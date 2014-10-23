System.register("test", ["./arrow-functions", "./module-a"], function(__es6_export__) {
    var mod;
    function arrow$functions$$(m) {}

    function module$a$$(m) {
        mod = m;
    }

    return {
        "setters": [arrow$functions$$, module$a$$],

        "execute": function() {
            "use strict";
            var $__Object$defineProperty = Object.defineProperty;
            var $__Object$create = Object.create;
            var $__Object$getPrototypeOf = Object.getPrototypeOf;
            var str = __es6_export__("str", "str");

            var Monster = function($__super) {
                "use strict";

                function Monster() {
                    $__Object$getPrototypeOf(Monster.prototype).constructor.call(this);
                }

                Monster.__proto__ = ($__super !== null ? $__super : Function.prototype);
                Monster.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

                $__Object$defineProperty(Monster.prototype, "constructor", {
                    value: Monster
                });

                return Monster;
            }(Object);

            // computed property keys (via es6-computed-property-keys)
            var obj = function() {
                var obj = {
                    ing: 2
                };

                obj[str] = 1;
                return obj;
            }.bind(this)();


            // default params (via es6-default-params)
            function def_params() {
                var a = (arguments[0] !== void 0 ? arguments[0] : 1);
            }
        }
    };
});

//# sourceMappingURL=test.js.map