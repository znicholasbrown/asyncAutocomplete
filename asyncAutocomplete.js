AutocompleteSearch = function (elem, data, callback) {
  this.$input = document.querySelector(elem);
  this.callback = callback;
  this.data = data;
  this.list = [];
  this.init()
}

AutocompleteSearch.prototype.init = function () {
  this.$ul = document.createElement('ul')
  this.$ul.setAttribute('class', 'ul_autocomplete')
  this.$input.parentNode.append(this.$ul)
  this.bindInput()
  this.bindList()
}

AutocompleteSearch.prototype.bindInput = function () {

  this.$input.addEventListener('focus', (e) => {
    if (this.list.length > 0) this.$ul.classList.add('ul_active');
  })
  this.$input.addEventListener('blur', (e) => {
    this.$ul.classList.remove('ul_active')
  })

  this.$input.addEventListener('keypress', (e) => {

    switch (e.key) {
      case "ArrowDown":
        break;
      case "ArrowUp":
        break;
      case "Enter":
        if (this.$input.value && this.highlighted) {
          this.callback ? this.callback(this.highlighted.data) : '';
          this.$input.value = this.highlighted.label;
          break;
        }
      default:
        break;
      }
  })

  this.$input.addEventListener('input', (e) => {

    if (e.defaultPrevented) {
      return;
    }

    if (e.target.value != "" && e.target.value) {
      this.data(e.target.value).then((g) => {
        this.clearLI();
        this.list = g;
        g.map((h, i) => this.addLI(h.label, h.value, h.category, e.target.value, i));

        if (this.list.length > 0) {
          this.highlighted = {label: this.list[0].label, data: this.list[0].value};
          this.$ul.classList.add('ul_active');
        }
      })
    } else {
      this.list = [];
      this.$ul.classList.remove('ul_active');
    }

    e.preventDefault();

    })
}

AutocompleteSearch.prototype.bindList = function () {
  this.clearLI = () => {
    while(this.$ul.firstChild) this.$ul.firstChild.remove();
  }
  this.addLI = (label, value, category, input, i) => {
    const $li = document.createElement('li');
    $li.setAttribute('id', 'li_' + i)
    $li.setAttribute('class', 'li_autocomplete')
    $li.innerHTML = '<span style="float:left">' + this.highlight(input, label) + '</span><span style="float:right; font-size:0.65rem; color: gray">' + category + '</span>';
    this.$ul.append($li)

    $li.addEventListener('click', (e) => {
      this.$input.value = this.list[i].label;
      this.callback ? this.callback(this.list[i].value) : '';
      this.list = [];
    })

    $li.addEventListener('pointerover', (e) => {
       this.highlighted = {label: this.list[i].label, data: this.list[i].value};
    })
  }
}

AutocompleteSearch.prototype.highlight = function (input, expected) {
  let lexpected = expected.toLowerCase(),
      linput = input.toLowerCase()

  let index = lexpected.indexOf(linput)

  return '<span>' + expected.slice(0, index) + '</span><span class="li_highlighted">' + expected.slice(index, index + input.length) + '</span><span>' + expected.slice(index + input.length) + '</span>';

}
