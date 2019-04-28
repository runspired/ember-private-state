import { module, test } from "qunit";
import { DEBUG } from "@glimmer/env";
import { DebugProxy, isPrivate } from "ember-private-state/debug";

module("DebugProxy", function() {
  test(`DebugProxy can be used`, async function(assert) {
    try {
      class TestObject {
        get myProp() {
          return null;
        }
      }
      const Test = DebugProxy(TestObject);
      assert.ok(!!Test, `DebugProxy does not error`);
    } catch (e) {
      assert.ok(
        false,
        `Unable to use DebugProxy in ${DEBUG ? "development" : "production"}: ${
          e.message
        }`
      );
    }
  });

  test(`DebugProxy returns an instantiable class`, async function(assert) {
    try {
      class TestObject {
        get myProp() {
          return null;
        }
      }
      const Test = DebugProxy(TestObject);
      new Test();
      assert.ok(true, `DebugProxy does not error`);
    } catch (e) {
      assert.ok(
        false,
        `Unable to instantiate via DebugProxy in ${
          DEBUG ? "development" : "production"
        }: ${e.message}`
      );
    }
  });

  test(`DebugProxy passes instanceof checks`, async function(assert) {
    class TestObject {
      get myProp() {
        return null;
      }
    }
    const Test = DebugProxy(TestObject);
    let instance = new Test();
    assert.ok(
      instance instanceof TestObject,
      `Passes instanceof check in ${DEBUG ? "development" : "production"}`
    );
  });

  if (DEBUG) {
    test(`DebugProxy shields private properties in development`, async function(assert) {
      let value = "abc";
      class TestObject {
        @isPrivate
        get myProp() {
          return value;
        }
        set myProp(v) {
          value = v;
        }
        toString() {
          return "TestObject";
        }
      }
      const Test = DebugProxy(TestObject);
      let instance = new Test();
      assert.throws(
        () => {
          instance.myProp;
        },
        /Illegal Access of private property 'myProp' on TestObject/,
        "We throw an error in development when accessing a private property"
      );
      assert.throws(
        () => {
          instance.myProp = "123";
        },
        /Illegal Attempt to set private property 'myProp' on TestObject to 123/,
        "We throw an error in development when setting a private property"
      );
    });
    test(`DebugProxy shields private methods in development`, async function(assert) {
      let value = "abc";
      class TestObject {
        @isPrivate
        get myProp() {
          return value;
        }
        set myProp(v) {
          value = v;
        }
        toString() {
          return "TestObject";
        }

        getValue() {
          return this.myProp;
        }
      }
      const Test = DebugProxy(TestObject);
      let instance = new Test();
      assert.equal(
        instance.getValue(),
        value,
        "We can access private state internally"
      );
    });
    test(`DebugProxy still allows instances to access their own private state`, async function(assert) {
      class TestObject {
        @isPrivate
        myProp(v) {
          return v;
        }
        toString() {
          return "TestObject";
        }
      }
      const Test = DebugProxy(TestObject);
      let instance = new Test();
      assert.throws(
        () => {
          instance.myProp("abc");
        },
        /Illegal Access of private method 'myProp' on TestObject/,
        "We throw an error in development when accessing a private property"
      );
    });
  } else {
    test(`DebugProxy does not shield private properties in production`, async function(assert) {
      let value = "abc";
      class TestObject {
        @isPrivate
        get myProp() {
          return value;
        }
        set myProp(v) {
          value = v;
        }
        toString() {
          return "TestObject";
        }
      }
      const Test = DebugProxy(TestObject);
      let instance = new Test();
      assert.equal(
        instance.myProp,
        "abc",
        "We do not throw an error when accessing a private property in production"
      );
      assert.equal(
        (instance.myProp = "123"),
        "abc",
        "We do not throw an error when setting a private property in production"
      );
      assert.equal(instance.myProp, "123", "We updated the value");
    });
    test(`DebugProxy does not shield private methods in production`, async function(assert) {
      class TestObject {
        @isPrivate
        myProp(v) {
          return v;
        }
        toString() {
          return "TestObject";
        }
      }
      const Test = DebugProxy(TestObject);
      let instance = new Test();
      assert.equal(
        instance.myProp("123"),
        "123",
        "We can invoke private methods in production"
      );
    });
  }
});
