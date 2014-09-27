System.register("arrow-functions", [], function(__es6_export__) {
    return {
        "setters": [],

        "execute": function() {
            "use strict";
            var x = function() {

            };

            // test as property value
            var y = {
                z: function() {
                    return null;
                }
            };

            // test as expression
            ((function() {
                return null;
            }));

            // test with a `this` binding
            function SomeClass() {
                var foo = function() {
                    return this instanceof SomeClass;
                }.bind(this);

                this.bar = function(baz) {
                    foo();
                };
            }

            // test as call argument
            (new SomeClass()).bar(function() {
                return this instanceof SomeClass;
            }.bind(this));
        }
    };
});

//# sourceMappingURL=arrow-functions.js.map