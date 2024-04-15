
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../utils/catchAsyncError');
const mongoose = require('mongoose');

exports.getAllTasks = catchAsyncError(async (req, res, next) => {
    try {
        let { page = 1, search } = req.query;
        const limit = 2;
        const query = {};
        if (search) {
            query.title = { $regex: new RegExp(search, 'i') };
        }

        const user = await User.findById(req.user.id).populate({
            path: 'tasks',
            match: query,
            options: {
                limit: limit,
                skip: (page - 1) * limit,
            }
        });

        // Total number of tasks
        const totalCount = await Task.countDocuments(query);

        res.status(200).json({
            tasks: user.tasks,
            totalPages: Math.ceil(totalCount / limit), // Total pages calculation
            currentPage: page,
            totalCount: totalCount
        });
    } catch (error) {
        next(error);
    }
});



exports.createTask = catchAsyncError(async (req, res, next) => {
    try {
        const { title, description, status, dueDate } = req.body;
        const createdBy = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(createdBy)) {
            throw new ErrorHandler('Invalid user ID', 400);
        }

        const user = await User.findById(createdBy);
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }

        const newTask = await Task.create({
            title,
            description,
            status,
            dueDate,
            createdBy,
        });


        user.tasks.push(newTask);


        await user.save();
        await newTask.save();

        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
});

exports.getTaskById = catchAsyncError(async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
});

exports.updateTask = catchAsyncError(async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const { title, description, status, dueDate } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, status, dueDate },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
});

exports.deleteTask = catchAsyncError(async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }


        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
});
