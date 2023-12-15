class Page {
  goto() { console.log('got another page') }
  setCookie() { console.log('set cookies') }
}

class CustomPage {
  constructor(page) {
    this.page = page;
  }

  static build() { //just a good way to build the combined class as a static function
    const page = new Page();
    const customPage = new CustomPage(page);

    const superPage = new Proxy(customPage, {
      get: function (target, property) {
        return target[property] || page[property];
      },
    });
    return superPage;
  }

  login() {
    this.page.goto();
    this.page.setCookie();
    console.log("all login logic");
  }
}

const superPage = CustomPage.build()


// const buildPage = () => {
//   const page = new Page();
//   const customPage = new CustomPage(page);


//   const superPage = new Proxy(customPage, {
//     get: function(target, property) {
//       return target[property] || page[property];
//     }
// })
// return superPage;
// }


superPage.goto();
superPage.setCookie();
superPage.login();


// customPage.login();
// customPage.page.goto();
// customPage.page.setCookie()

