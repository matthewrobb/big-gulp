var x = ()=> {

};

// test as property value
var y = {
    z: ()=> null
};

// test as expression
(()=>null) 

// test with a `this` binding
function SomeClass() {
    var foo = ()=> this instanceof SomeClass;

    this.bar = function(baz) {
        foo();
    };
}

// test as call argument
(new SomeClass()).bar(()=> this instanceof SomeClass);
