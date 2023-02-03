class Test {
    constructor(a, b) {
        this.a = a
        this.b = b

        this.c = 3
        this.d = 4
    }

    plus() {
        return this.a + this.b
    }

    static total(a, b, c, d) {
        return a + b + c + d
    }
}

class Test1 extends Test {
    constructor(a, b) {
        super(a, b)
        console.log(this);

        this.content = ''
    }
    get res() {
        return this.content
    }

    set res(newValue) {
        this.content = newValue
        update()
    }
}
const test1 = new Test1(1, 2)
const res = test1.plus()
const res1 = test1.setRes()
console.log(res);