(function() {

  if (typeof module !== 'undefined' && module.exports) {
    require('./spec_helper');
    require('../src/jquery.transparency');
  }

  describe("Transparency", function() {
    it("should calculate values with directives", function() {
      var directives, doc, expected, person;
      doc = jQuery('<div>\
        <div class="person">\
          <span class="name"></span><span class="email"></span>\
        </div>\
      </div>');
      person = {
        firstname: 'Jasmine',
        lastname: 'Taylor',
        email: 'jasmine.tailor@example.com'
      };
      directives = {
        name: function(element) {
          return "" + this.firstname + " " + this.lastname;
        }
      };
      expected = jQuery('<div>\
        <div class="person">\
          <span class="name">Jasmine Taylor</span>\
          <span class="email">jasmine.tailor@example.com</span>\
        </div>\
      </div>');
      doc.find('.person').render(person, directives);
      return expect(doc.html()).htmlToBeEqual(expected.html());
    });
    return it("should handle nested directives", function() {
      var directives, doc, expected, nameDecorator, person;
      doc = jQuery('<div>\
        <div class="person">\
          <span class="name"></span>\
          <span class="email"></span>\
          <div class="friends">\
            <div class="friend">\
              <span class="name"></span>\
              <span class="email"></span>\
            </div>\
          </div>\
        </div>\
      </div>');
      person = {
        firstname: 'Jasmine',
        lastname: 'Taylor',
        email: 'jasmine.taylor@example.com',
        friends: [
          {
            firstname: 'John',
            lastname: 'Mayer',
            email: 'john.mayer@example.com'
          }, {
            firstname: 'Damien',
            lastname: 'Rice',
            email: 'damien.rice@example.com'
          }
        ]
      };
      nameDecorator = function(element) {
        return "" + this.firstname + " " + this.lastname;
      };
      directives = {
        name: nameDecorator,
        friends: {
          name: nameDecorator
        }
      };
      expected = jQuery('<div>\
        <div class="person">\
          <span class="name">Jasmine Taylor</span>\
          <span class="email">jasmine.taylor@example.com</span>\
          <div class="friends">\
            <div class="friend">\
              <span class="name">John Mayer</span>\
              <span class="email">john.mayer@example.com</span>\
            </div>\
            <div class="friend">\
              <span class="name">Damien Rice</span>\
              <span class="email">damien.rice@example.com</span>\
            </div>\
          </div>\
        </div>\
      </div>');
      doc.find('.person').render(person, directives);
      return expect(doc.html()).htmlToBeEqual(expected.html());
    });
  });

}).call(this);
