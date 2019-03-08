function print(s){
    console.log(s);
}
// 类型校验
print(typeof String) //function
print(typeof Number) //function
print(typeof Boolean)//function
print(typeof Object)//function
print(typeof null)//object
print(typeof undefined)//undefined
print(typeof 'string') //string
print(typeof 10)//number
print(typeof false)//boolean

// 字面量原型集成是通过 object 的 __proto__ 属性连接到 Object.prototype
var obj = {
    name: 'Jone'
}
obj.__proto__ === Object.prototype //true

if (typeof Object.create !== 'function') {   //此函数保证新 object 可以从 o 继承
    Object.create = function(o) {
        var F = function() {};  
        F.prototype = o;
        return new F();  //通过 new prefix 创建的对象的 __proto__ 会连接到函数的 prototype 属性
    };
}
var another_obj = Object.create(obj);

// 函数字面量 函数的 prototype 属性 和 函数原型
function func() {}
print(func.__proto__ == Function.prototype) //true
print(func.constructor === Function) //true

Function.prototype.method = function(name, func) { //为函数添加 method 方法, Object 也是一个函数
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};

print(func.prototype.constructor) //function func(){} 函数的 prototype 属性是一个 object，object 的 constructor 指向函数本身


String.method('deentityify', function() {

    var entity = {
        quot: '"',
        lt: '<',
        gt: '>'
    };


    return function() {
        return this.replace(/&([^&;]+);/g,
            function(a, b) {
                var r = entity[b];
                return typeof r === 'string' ? r : a;
            }
        );
    };
}());



var myMammal = {
    name : 'Herb the Mammal',
    get_name : function (  ) {
        return this.name;
    },
    says : function (  ) {
        return this.saying || '';
    }
};

var myCat = Object.create(myMammal);
myCat.name = 'Henrietta';
myCat.saying = 'meow';
myCat.purr = function (n) {
    var i, s = '';
    for (i = 0; i < n; i += 1) {
        if (s) {
            s += '-';
        }
        s += 'r';
    }
    return s;
};
myCat.get_name = function (  ) {
    return this.says() + ' ' + this.name + ' ' + this.says();
};

print(myCat.get_name()) //meow Henrietta meow


var mammal = function (spec) {
    var that = {};

    that.get_name = function (  ) {
        return spec.name;
    };

    that.says = function (  ) {
        return spec.saying || '';
    };

    return that;
};

var myMammal = mammal({name: 'Herb'});


var cat = function (spec) {
    spec.saying = spec.saying || 'meow';
    var that = mammal(spec);
    that.purr = function (n) {
        var i, s = '';
        for (i = 0; i < n; i += 1) {
            if (s) {
                s += '-';
            }
            s += 'r';
        }
        return s;
    };
    that.get_name = function () {
        return that.says() + ' ' + spec.name + ' ' + that.says();
    };
    return that;
};

var myCat = cat({name: 'Henrietta'});

Object.method('superior', function (name) {
    var that = this,
        method = that[name]; 
    return function (  ) {
        return method.apply(that, arguments);
    };
});

var coolcat = function (spec) {
    var that = cat(spec),
        super_get_name = that.superior('get_name'); //获取超类的方法
    that.get_name = function (n) {  //覆盖超类方法
        return 'like ' + super_get_name(  ) + ' baby';
    };
    return that;
};

var myCoolCat = coolcat({name: 'Bix'});
print(myCoolCat.get_name(  ));//'like meow Bix meow baby”
