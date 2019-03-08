## 简单数据类型

JavaScript 的简单数据类型是 string，number，boolean，undefined，null，除此之外其他都是 object。

string，number，boolean 都是 object-like，因为他们都有方法，只是不可变数据类型。

## objects

> “Objects in JavaScript are mutable keyed collections.”
>
> 摘录来自: Douglas Crockford. “JavaScript: The Good Parts”。 iBooks. 

JavaScript 中除了 undefined 其他一切都是 object。

String，Number，Boolean，Array，function，object 都是 object，因为他们都可以有属性。

JavaScript object 通过 prototype chain 继承。

prototype 继承是一种动态继承，添加到 prototype 上的属性可以立即被原型的所有对象看到。

prototype 继承的属性只能 retrieve ，不能被更改或删除。

通过 object literal 创建的对象通过自身的 `__proto__` 属性隐形链接到 Object.prototype 来完成继承。

> “Every object is linked to a prototype object from which it can inherit properties. All objects created from object literals are linked to Object.prototype, an object that comes standard with JavaScript”
> 摘录来自: Douglas Crockford. “JavaScript: The Good Parts”。 iBooks. 

```javascript
var obj = {name: 'Jone'}
obj.__proto__ === Object.prototype //true
```

通过为 `Object` 添加 create 方法来显式完成 prototype 的继承。

```javascript
if (typeof Object.create !== 'function') {
     Object.create = function (o) {
         var F = function () {};
         F.prototype = o;
         return new F();
     };
}
var another_obj = Object.create(obj);
```

## function 

function 是 object，所以 function 可以有属性、方法等 object 的特性，而且和 object 一样，function 自身也是通过 prototype 继承的，function 创建时自身隐藏的属性 `__proto__`连接的是 Function.prototype。


```javascript
function func(){}
func.__proto__ == Function.prototype //true
func.constructor === Function //true
```

每个函数在定义时都会具有一个 context 以及函数体包含的函数的行为。

通过为函数原型上加上method方法，每次调用该方法，新生成的函数出现函数的 prototype 属性中

 ```JavaScript
 Function.prototype.method = function (name, func) {
 	if (!this.prototype[name]) {
 		this.prototype[name] = func;
 		return this;
 }};
 ```

摘录来自: Douglas Crockford. “JavaScript: The Good Parts”。 iBooks. 

**function 的 prototype 属性**

>“Every function object is also created with a prototype property. Its value is an object with a constructor property whose value is the function. This is distinct from the hidden link to Function.prototype. The meaning of this convoluted construction will be revealed in the next chapter.”

摘录来自: Douglas Crockford. “JavaScript: The Good Parts”。 iBooks. 


```javascript
func.prototype.constructor //function func(){}
```

### function creation

**function literal**

和 object 一样，function 可以使用 literal 方式创建

```javascript
var add = function(){}
```

### function invocation pattern


**method invocation**

作为 object 的 property 调用

```JavaScript
var obj = {
    value: 1,
    add: function(x){
        return x+this.value;
    }
}

obj.add(10)
```

函数的 context bind 到 对象 obj

**function invocation**


```JavaScript
add(x, y)
```

函数的 context bind 到全局 Window

**constructor invocation**


>“If a function is invoked with the new prefix, then a new object will be created with a hidden link to the value of the function's prototype member, and this will be bound to that new object”

摘录来自: Douglas Crockford. “JavaScript: The Good Parts”。 iBooks. 


function invocation with new prefix，生成的 object 隐藏连接到 function 的 prototype 属性

```JavaScript
function func(){}
var obj = new func();
obj.__proto__ === func.prototype //true
obj.constructor === func //true
obj.constructor.__proto__ === Function.prototype
```

对象将通过函数的 prototype 属性进行继承


**apply invocation pattern**


apply 模式可以改变调用函数的上下文

```javascript
func.apply(null, array)
```

### scope

JavaScript 不是 block scope 而是 function scope

```javascript
function func(){
  for(var i=0;i<10;i++){}
  console.log(i) //10
}
```

classical error

```JavaScript
var add_the_handlers = function (nodes) {
    var i;
    for (i = 0; i < nodes.length; i += 1) {
        nodes[i].onclick = function (e) {
            alert(i);
        };
    }
};
```

事件触发之后的输出始终等于 nodes 的`节点长度 -1 `，由于闭包的原因，内部函数始终持有外部函数的变量 i，而外部变量又是一个 function scope。

### closure

“The good news about scope is that inner functions get access to the parameters and variables of the functions they are defined within (with the exception of this and arguments). This is a very good thing”

“A more interesting case is when the inner function has a longer lifetime than its outer function.”

“This is possible because the function has access to the context in which it was created. This is called closure.”

摘录来自: Douglas Crockford. “JavaScript: The Good Parts”。 iBooks. 

闭包带来的好处是对变量作用域的真正私有化。

```javascript
var myObject = (function () {
    var value = 0;

    return {
        increment: function (inc) {
            value += typeof inc === 'number' ? inc : 1;
        },
        getValue: function (  ) {
            return value;
        }
    };
}());

```

value 在 myobject 创建的作用于内，不能直接访问。

### module

可以借助 object 或者 function 来实现 module，module 的作用是隐藏内部状态，屏蔽实现细节。使用 function 做 module 甚至可以替代全局变量。

“We could define it in the function itself, but that has a runtime cost because the literal must be evaluated every time the function is invoked. The ideal approach is to put it in a closure”

摘录来自: Douglas Crockford. “JavaScript: The Good Parts”。 iBooks. 

直接在 function 内放置全局变量会带来运行时开销，好的办法是使用闭包。

```javascript
String.method('deentityify', function (  ) {

// The entity table. It maps entity names to
// characters.

    var entity = {
        quot: '"',
        lt:   '<',
        gt:   '>'
    };

// Return the deentityify method.

    return function (  ) {

// This is the deentityify method. It calls the string
// replace method, looking for substrings that start
// with '&' and end with ';'. If the characters in
// between are in the entity table, then replace the
// entity with the character from the table. It uses
// a regular expression (Chapter 7).
        return this.replace(/&([^&;]+);/g,
            function (a, b) {
                var r = entity[b];
                return typeof r === 'string' ? r : a;
            }
        );
    };
}(  ));
```
### curry

```javascript
Function.method('curry', function (  ) {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments),
        that = this;
    return function (  ) {
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});
```



## inherit


JavaScript 的继承虽然有多种形式，但是通过 prototype 和闭包来实现继承是最有效而且最好的，因为可以很好的保护私有状态不被改变，并且对象可以很好的从一个 old object 继承他的全部属性，并且可以调用。

直接从一个对象继承他的属性虽然有别与经典的用类来继承，但这在 JavaScript 中容易而且好理解，也就是你可以用一个对象造出很多相似的对象

```
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


```


### Functional

使用函数实现对象属性的私有化

```
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


```

spec 是对象的属性，在函数内部形成了一个新的对象，而且这个对象引用了 spec 中属性，形成闭包保证了属性的私有化


```
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


```

在 cat 内部，cat 只关心自身的差别，不需要考虑它继承的对象是如何实现的，在这里我们直接通过 that.says 调用到了父对象，相当于一个 super。

自动实现一个 super 

```
Object.method('superior', function (name) {
    var that = this,
        method = that[name];
    return function (  ) {
        return method.apply(that, arguments);
    };
});

var coolcat = function (spec) {
    var that = cat(spec),
        super_get_name = that.superior('get_name');
    that.get_name = function (n) {
        return 'like ' + super_get_name(  ) + ' baby';
    };
    return that;
};

var myCoolCat = coolcat({name: 'Bix'});
var name = myCoolCat.get_name(  );
//'like meow Bix meow baby”


```

mammal 函数负责创建新的对象，所有的继承要从这里开始，只有调用了 mammal 才会在每次调用子对象时生成一个新的对象。


## array

JavaScript 的 array 并不是真正的 array，他的索引实际上是非负数的 property name

### literal array

```
var a = [];
var b = [1,2,3,4,5,6];

a[0] //undeinfed
b[0] //1

```

一个不存在的索引的值是 undefined


### array length 

length 是个很特殊的属性，length 并不能代表真正的数组的长度，而是表示 数组中最大的正整数索引+1


```
var a = []
a[1001] = 10
a.length // 1002

```

可以显式改变 length 的长度，length 变大并不意味着数组的实际长度变大，length 变小会让数组把多余的元素舍弃

```
var a = [];
var b = [1,2,3,4,5,6];
a.length = 10;
a //[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined]
b.length = 3;
a //[1,2,3]
```


### delete 

```
var a = [1,3,4,5,6];
delete a[1];
a //[1,undefined,4,5,6]
```

删除一个元素并不会真正删除这个位置，而是此位置是 undefined，

利用 splice

```
var a = [1,2,3,4,5,6];
a.splice(1,2)
a //[1,4,5,6]

```


### inspect array

```
var is_array = function (value) {
    return Object.prototype.toString.apply(value) === '[object 
Array]';
};

```

