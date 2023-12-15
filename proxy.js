class Greetings {
  english() {
    return 'hello';
  }

  spanish() {
    return 'hola'
  }
}

class MoreGreetings {
  german() {
    return 'Hallo'
  }

  french() {
    return 'Bonjour';
  }
}


const greetings = new Greetings();
const moreGreetings = new MoreGreetings();

const allGreetings = new Proxy(moreGreetings, { //second argument is handler is an ob that contains a set of cuntions which get executed everytime when we try to accesss ptoperties of the underlying trying onject
  get: function(target, property) {
    return moreGreetings[property];
  }
});

allGreetings.french
