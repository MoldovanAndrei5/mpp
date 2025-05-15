"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var app = (0, express_1.default)();
var port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var cars = [
    { id: 0, photo: "./ferrari458italia.jpeg", name: "Ferrari 458 Italia", price: 125000 },
    { id: 1, photo: "./lamborghinigallardo.jpeg", name: "Lamborghini Gallardo", price: 100000 },
    { id: 2, photo: "./mclaren675lt.jpeg", name: "Mclaren 675lt", price: 150000 },
    { id: 3, photo: "./mercedesamggts.jpeg", name: "Mercedes AMG GT S", price: 80000 },
    { id: 4, photo: "./bmwm4gts.jpeg", name: "Bmw M4 GTS", price: 100000 }
];
app.get('/api/cars?priceRange=150000', function (req, res) {
    var _a = req.query, sortBy = _a.sortBy, priceRange = _a.priceRange, name = _a.name;
    if (!priceRange || isNaN(Number(priceRange))) {
        return res.status(400).json({ error: "Invalid or missing 'priceRange' query parameter" });
    }
    var filteredName = (name || '').toLowerCase();
    var result = __spreadArray([], cars, true).filter(function (car) {
        return car.price <= parseInt(priceRange) &&
            car.name.toLowerCase().includes(filteredName);
    });
    switch (sortBy) {
        case "price_asc":
            result.sort(function (a, b) { return a.price - b.price; });
            break;
        case "price_desc":
            result.sort(function (a, b) { return b.price - a.price; });
            break;
        case "name_asc":
            result.sort(function (a, b) { return a.name.localeCompare(b.name); });
            break;
        case "name_desc":
            result.sort(function (a, b) { return b.name.localeCompare(a.name); });
            break;
        default:
            break;
    }
    res.json(result);
});
app.post('/api/cars', function (req, res) {
    var _a = req.body, name = _a.name, price = _a.price, photo = _a.photo;
    if (!name || !price || !photo || price <= 0) {
        return res.status(400).json({ error: 'Bad request: Missing required fields or invalid data.' });
    }
    var newCar = {
        id: cars.length > 0 ? Math.max.apply(Math, cars.map(function (car) { return car.id; })) + 1 : 0,
        name: name,
        price: price,
        photo: photo
    };
    cars.push(newCar);
    // Send the created car data with a 201 status code (Created)
    res.status(201).json(newCar);
});
// PUT route to update a car
app.put('/api/cars/:id', function (req, res) {
    var id = req.params.id;
    var _a = req.body, name = _a.name, price = _a.price, photo = _a.photo;
    var carIndex = cars.findIndex(function (car) { return car.id === parseInt(id); });
    if (carIndex === -1) {
        return res.status(404).json({ error: 'Car not found' });
    }
    // Update the car object
    var updatedCar = __assign(__assign({}, cars[carIndex]), { name: name, price: price, photo: photo });
    cars[carIndex] = updatedCar;
    res.status(200).json(updatedCar);
});
// DELETE route to delete a car
app.delete('/api/cars/:id', function (req, res) {
    var id = req.params.id;
    var carIndex = cars.findIndex(function (car) { return car.id === parseInt(id); });
    if (carIndex === -1) {
        return res.status(404).json({ error: 'Car not found' });
    }
    var deletedCar = cars.splice(carIndex, 1)[0];
    res.status(200).json(deletedCar);
});
// Start the server
app.listen(port, function () {
    console.log("Server running at http://localhost:".concat(port));
});
