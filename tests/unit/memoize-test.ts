import { module, test } from 'qunit';
import { DEBUG } from '@glimmer/env';
import memoize from 'ember-private-state/memoize';

module('@memoize', function() {
    test(`memoized methods can be defined in ${DEBUG ? 'development' : 'production'}`, async function(assert) {
        try {
            class TestObject {
                @memoize(a => a)
                myProp(a) { return a * a; }
            }
            new TestObject();
            assert.ok(true, `Defined a memoized method`);
        } catch (e) {
            assert.ok(false, `Unable to define memoized method in ${DEBUG ? 'development' : 'production'}: ${e.message}`);
        }
    });

    test(`memoize cannot be used for props in ${DEBUG ? 'development' : 'production'}`, async function(assert) {
        try {
            class TestObject {
                @memoize(_ => '1')
                get myProp() { return null; }
            }
            new TestObject();
            assert.ok(false, `Defined a memoized property`);
        } catch (e) {
            assert.ok(true, `Unable to define memoized property in ${DEBUG ? 'development' : 'production'}: ${e.message}`);
        }
    });
/*
    test(`lazyProps return the value from the getter in ${DEBUG ? 'development' : 'production'}`, async function(assert) {
        class TestObject {
            @lazyProp
            get myProp() { return 'abc'; }
        }
        let instance = new TestObject();
        instance.myProp;
        assert.equal(instance.myProp, 'abc', `lazyProp returns the right value in ${DEBUG ? 'development' : 'production'}`);
    });

    test(`lazyProps are lazy in ${DEBUG ? 'development' : 'production'}`, async function(assert) {
        let calculated = false;
        class TestObject {
            @lazyProp
            get myProp() { calculated = true; return 'a'; }
        }
        let instance = new TestObject();
        assert.equal(calculated, false, `lazyProp has not calculated prior to first access in ${DEBUG ? 'development' : 'production'}`);
        instance.myProp;
        assert.equal(calculated, true, `lazyProp has calculated after first access in ${DEBUG ? 'development' : 'production'}`);
    });

    test(`lazyProps are only cacluated once in ${DEBUG ? 'development' : 'production'}`, async function(assert) {
        let calculated = 0;
        class TestObject {
            @lazyProp
            get myProp() { calculated++; return 'a'; }
        }
       let instance = new TestObject();
        assert.equal(calculated, 0, `lazyProp has not calculated prior to first access in ${DEBUG ? 'development' : 'production'}`);
        instance.myProp;
        assert.equal(calculated, 1, `lazyProp calculated once on first access in ${DEBUG ? 'development' : 'production'}`);
        instance.myProp;
        assert.equal(calculated, 1, `lazyProp has not recalculated after first access in ${DEBUG ? 'development' : 'production'}`);
    });

    if (DEBUG) {
        test(`lazyProps do not add a field to the prototype or instance in development`, async function(assert) {
            class TestObject {
                @lazyProp
                get myProp() { return 'a'; }
            }
            let instance = new TestObject();
            assert.equal(instance.hasOwnProperty('___myProp'), false, 'We did not add to the instance');
            assert.equal(TestObject.prototype.hasOwnProperty('___myProp'), false, 'We did not add to the prototype');
        });
    } else {
        test(`lazyProps add a field to the prototype in production`, async function(assert) {
            class TestObject {
                @lazyProp
                get myProp() { return 'a'; }
            }
            let instance = new TestObject() as { myProp: string, ___myProp: string };
            assert.equal(instance.hasOwnProperty('___myProp'), false, 'We did not add to the instance');
            assert.equal(TestObject.prototype.hasOwnProperty('___myProp'), true, 'We added to the prototype');
            instance.myProp;
            let proto = TestObject.prototype as { myProp: string, ___myProp: null };
            assert.equal(proto.___myProp, null, 'we do not alter the prototype on access');
            assert.equal(instance.___myProp, 'a', 'we assign to the instance on access');
        });
    }
    */
});