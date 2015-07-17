define(['angular', 'angular-mocks', 'src/fasterNgEventDirectives'], function(angular, angularMocks, fasterNgEventDirectives) {
    'use strict';


        beforeEach(function() {
            module('fng');
        });


    describe('standard angular tests for event directives', function() {
        var element;

        describe('fngSubmit', function() {

            it('should get called on form submit', inject(function($rootScope, $compile) {
                element = $compile('<form action="/foo" fng-submit="submitted = true">' +
                    '<input type="submit"/>' +
                    '</form>')($rootScope);
                $rootScope.$digest();

                // prevent submit within the test harness
                element.on('submit', function(e) {
                    e.preventDefault();
                });

                expect($rootScope.submitted).not.toBeDefined();

                element.children().eq(0).submit();
                expect($rootScope.submitted).toEqual(true);
            }));

            it('should expose event on form submit', inject(function($rootScope, $compile) {
                $rootScope.formSubmission = function(e) {
                    if (e) {
                        $rootScope.formSubmitted = 'foo';
                    }
                };

                element = $compile('<form action="/foo" fng-submit="formSubmission($event)">' +
                    '<input type="submit"/>' +
                    '</form>')($rootScope);
                $rootScope.$digest();

                // prevent submit within the test harness
                element.on('submit', function(e) {
                    e.preventDefault();
                });

                expect($rootScope.formSubmitted).not.toBeDefined();

                element.children().eq(0).submit();
                expect($rootScope.formSubmitted).toEqual('foo');
            }));
        });

        describe('focus', function() {

            describe('call the listener asynchronously during $apply', function() {
                function run(scope) {
                    inject(function($compile) {
                        element = $compile('<input type="text" fng-focus="focus()">')(scope);
                        scope.focus = jasmine.createSpy('focus');

                        scope.$apply(function() {
                            element.triggerHandler('focus');
                            expect(scope.focus).not.toHaveBeenCalled();
                        });

                        expect(scope.focus).toHaveBeenCalled();
                    });
                }

                it('should call the listener with non isolate scopes', inject(function($rootScope) {
                    run($rootScope.$new());
                }));

                it('should call the listener with isolate scopes', inject(function($rootScope) {
                    run($rootScope.$new(true));
                }));

            });

            it('should call the listener synchronously inside of $apply if outside of $apply',
                inject(function($rootScope, $compile) {
                    element = $compile('<input type="text" fng-focus="focus()" ng-model="value">')($rootScope);
                    $rootScope.focus = jasmine.createSpy('focus').andCallFake(function() {
                        $rootScope.value = 'newValue';
                    });

                    element.triggerHandler('focus');

                    expect($rootScope.focus).toHaveBeenCalled();
                    expect(element.val()).toBe('newValue');
                }));

        });

        describe('security', function() {
            it('should allow access to the $event object', inject(function($rootScope, $compile) {
                var scope = $rootScope.$new();
                element = $compile('<button fng-click="e = $event">BTN</button>')(scope);
                element.triggerHandler('click');
                expect(scope.e.target).toBe(element[0]);
            }));

            it('should block access to DOM nodes (e.g. exposed via $event)', inject(function($rootScope, $compile) {
                var scope = $rootScope.$new();
                element = $compile('<button fng-click="e = $event.target">BTN</button>')(scope);
                expect(function() {
                    element.triggerHandler('click');
                }).toThrow();
            }));
        });

        describe('blur', function() {

            describe('call the listener asynchronously during $apply', function() {
                function run(scope) {
                    inject(function($compile) {
                        element = $compile('<input type="text" fng-blur="blur()">')(scope);
                        scope.blur = jasmine.createSpy('blur');

                        scope.$apply(function() {
                            element.triggerHandler('blur');
                            expect(scope.blur).not.toHaveBeenCalled();
                        });

                        expect(scope.blur).toHaveBeenCalled();
                    });
                }

                it('should call the listener with non isolate scopes', inject(function($rootScope) {
                    run($rootScope.$new());
                }));

                it('should call the listener with isolate scopes', inject(function($rootScope) {
                    run($rootScope.$new(true));
                }));

            });

            it('should call the listener synchronously inside of $apply if outside of $apply',
                inject(function($rootScope, $compile) {
                    element = $compile('<input type="text" fng-blur="blur()" ng-model="value">')($rootScope);
                    $rootScope.blur = jasmine.createSpy('blur').andCallFake(function() {
                        $rootScope.value = 'newValue';
                    });

                    element.triggerHandler('blur');

                    expect($rootScope.blur).toHaveBeenCalled();
                    expect(element.val()).toBe('newValue');
                }));

        });
    });

    describe('fng scope propagation tests', function() {
        var element;

        describe('click', function() {

            var root, child, grandChild, greatGrandChild;
            var childCalled, rootCalled, grandChildCalled, greatGrandChildCalled;

            beforeEach(inject(function($rootScope) {
                root = $rootScope;
                child = $rootScope.$new();
                grandChild = child.$new();
                greatGrandChild = grandChild.$new();

                grandChildCalled = jasmine.createSpy('grandChildCalled');
                greatGrandChildCalled = jasmine.createSpy('greatGrandChildCalled');
                childCalled = jasmine.createSpy('childCalled');
                rootCalled = jasmine.createSpy('rootCalled');

                root.$watch(rootCalled);
                child.$watch(childCalled);
                grandChild.$watch(grandChildCalled);
                greatGrandChild.$watch(greatGrandChildCalled);
            }));

            it('should act regularly on a click', inject(function($compile) {
                element = $compile('<a fng-click="te()"></a>')(child);
                element.click();

                expect(rootCalled).toHaveBeenCalled();
                expect(childCalled).toHaveBeenCalled();
                expect(grandChildCalled).toHaveBeenCalled();
                expect(greatGrandChildCalled).toHaveBeenCalled();

            }));

            it('when $stopDigestPropagation is set to child, should call there and children', inject(function($compile) {
                element = $compile('<a fng-click="te()"></a>')(grandChild);
                child.$stopDigestPropagation = true;
                element.triggerHandler('click');

                expect(rootCalled).not.toHaveBeenCalled();
                expect(childCalled).toHaveBeenCalled();
                expect(grandChildCalled).toHaveBeenCalled();
                expect(greatGrandChildCalled).toHaveBeenCalled();
            }));
            it('when $stopDigestPropagation is set to grandChild, should call there and children', inject(function($compile) {
                element = $compile('<a fng-click="te()"></a>')(grandChild);
                grandChild.$stopDigestPropagation = true;
                element.triggerHandler('click');

                expect(rootCalled).not.toHaveBeenCalled();
                expect(childCalled).not.toHaveBeenCalled();
                expect(grandChildCalled).toHaveBeenCalled();
                expect(greatGrandChildCalled).toHaveBeenCalled();
            }));

            it('when $stopDigestPropagation is set to greatGrandChild, should call there', inject(function($compile) {
                element = $compile('<a fng-click="te()"></a>')(greatGrandChild);
                greatGrandChild.$stopDigestPropagation = true;
                element.triggerHandler('click');

                expect(rootCalled).not.toHaveBeenCalled();
                expect(childCalled).not.toHaveBeenCalled();
                expect(grandChildCalled).not.toHaveBeenCalled();
                expect(greatGrandChildCalled).toHaveBeenCalled();
            }));

            describe('call the listener asynchronously during $apply, fallback to standard digest', function() {
                function run(scope) {
                    inject(function($compile) {
                        element = $compile('<input type="text" fng-blur="blur()">')(scope);
                        scope.$stopDigestPropagation = true;
                        scope.blur = jasmine.createSpy('blur');

                        scope.$apply(function() {
                            element.triggerHandler('blur');
                            expect(scope.blur).not.toHaveBeenCalled();
                        });

                        expect(scope.blur).toHaveBeenCalled();
                    });
                }

                it('should call the listener with non isolate scopes', inject(function($rootScope) {
                    run($rootScope.$new());
                }));

                it('should call the listener with isolate scopes', inject(function($rootScope) {
                    run($rootScope.$new(true));
                }));

            });


        });
    });
});