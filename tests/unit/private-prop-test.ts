import { module, test } from 'qunit';
import { isPrivate } from 'ember-private-state/debug';

module('@isPrivate', function() {
    test(`isPrivate props can be defined`, async function(assert) {
        try {
            class TestObject {
                @isPrivate
                get myProp() { return null; }
            }
            new TestObject();
            assert.ok(true, `Defined private property`);
        } catch (e) {
            assert.ok(false, `Unable to define private property: ${e.message}`);
        }
    });

    test(`isPrivate return the value from the getter`, async function(assert) {
        class TestObject {
            @isPrivate
            get myProp() { return 'abc'; }
        }
        let instance = new TestObject();
        instance.myProp;
        assert.equal(instance.myProp, 'abc', `isPrivate returns the right value`);
    });

    test(`isPrivate uses the setter`, async function(assert) {
        let value = null;
        class TestObject {
            @isPrivate
            set myProp(v) { value = v; }
        }
        let instance = new TestObject();
        instance.myProp = 'abc';
        assert.equal(value, 'abc', `isPrivate uses the setter`);
    });

    test(`isPrivate works with methods`, async function(assert) {
        let value = null;
        class TestObject {
            @isPrivate
            myProp(v) { value = v; }
        }
        let instance = new TestObject();
        instance.myProp('abc');
        assert.equal(value, 'abc', `isPrivate works with methods`);
    });
});