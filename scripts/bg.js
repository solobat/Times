/**
 *@file background script
 *@author tomasy
 */

var Things;
var Backbone = window.Backbone;

function getThingListInstance() {
    var Thing = Backbone.Model.extend({

        defaults: function () {
            return {
                title: 'empty thing...',
                order: Things.nextOrder(),
                done: false

            };
        },

        toggle: function () {
            this.save({
                done: !this.get('done')

            });
        }

    });

    var ThingList = Backbone.Collection.extend({

        model: Thing,

        localStorage: new Backbone.LocalStorage('Things-backbone'),

        done: function () {
            return this.where({
                done: true

            });
        },

        remaining: function () {
            return this.where({
                done: false

            });
        },

        nextOrder: function () {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },

        comparator: 'order'
    });

    Things = new ThingList();

    checkNewDate();

    return Things;
}

function dateFormat(date, split) {
    if (!date) {
        return;
    }

    var m = date.getMonth() + 1;
    var d = date.getDate();

    return [
        date.getFullYear(),
        m < 10 ? '0' + m : m,
        d < 10 ? '0' + d : d
    ].join(split || '');
}

function checkNewDate() {
    var today = +dateFormat(new Date());
    var lastDate = +localStorage['last_date'];

    if (!lastDate || today > lastDate) {
        setTimeout(function () {
            resetTimes();
            localStorage['last_date'] = today;

        }, 1000);

    }
}

function resetTimes() {
    if (!Things) {
        return;
    }

    var models = Things.models;

    models.forEach(function (model) {
        model.save({
            curtimes: 0,
            level: 0,
            color: 'gray'

        });
    });
}
