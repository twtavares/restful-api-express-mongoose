var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Item = require('./models/item');

var app = express();

var PORT = 8080;
var HOST_NAME = 'localhost';
var DATABASE_NAME = 'shoppingList';

mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var itemRouter = express.Router();

itemRouter
  .route('/items')
  .post(function (request, response) {

    console.log('POST /items');

    var item = new Item(request.body);

    item.save();

    response.status(201).send(item);
  })
  .get(function (request, response) {

    console.log('GET /items');

    Item.find(function (error, item) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(item);

      response.json(item);
    });
  });

itemRouter
  .route('/items/:itemId')
  .get(function (request, response) {

    console.log('GET /items/:itemId');

    var itemId = request.params.itemId;

    Item.find({ id: itemId }, function (error, item) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(item);

      response.json(item);

    });
  })
  .put(function (request, response) {

    console.log('PUT /items/:itemId');

    var itemId = request.params.itemId;

    Item.findOne({ id: itemId }, function (error, item) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      if (item) {
        item.name = request.body.name;
        item.description = request.body.description;
        item.quantity = request.body.quantity;
        item.save();

        response.json(item);
        return;
      }

      response.status(404).json({});
    });
  })
  .patch(function (request, response) {

    console.log('PATCH /items/:itemId');

    var itemId = request.params.itemId;

    Item.findOne({ id: itemId }, function (error, item) {
      if (error) {
        response.status(500).send(error);
        return;
      }

      if (item) {
        if (request.body.name) {
          item.name = request.body.name;
        }

        if (request.body.description) {
          item.description = request.body.description;
        }

        if (request.body.quantity) {
          item.quantity = request.body.quantity;
        }

        item.save();

        response.json(item);
        return;
      }

      response.status(404).json({});
    });
  })
  .delete(function (request, response) {

    console.log('DELETE /items/:itemId');

    var itemId = request.params.itemId;

    Item.findOne({ id: itemId }, function (error, item) {
      if (error) {
        response.status(500).send(error);
        return;
      }

      if (item) {
        item.remove(function (error) {
          if (error) {
            response.status(500).send(error);
            return;
          }

          response.status(204).json({
            'status': 'Removed'
          });
          return;
        });
      }

      response.status(404).json({});
    });
  });

app.use('/api', itemRouter);

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
