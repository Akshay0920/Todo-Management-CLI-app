'use strict';
const { Model, Op } = require('sequelize');
const dayjs = require('dayjs');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }

static async showList() {
    const allTodos = await Todo.findAll({
        order: [['dueDate', 'ASC']],
    });

    const overdueTodos = allTodos.filter(todo => dayjs(todo.dueDate).isBefore(dayjs(), 'day'));
    const dueTodayTodos = allTodos.filter(todo => dayjs(todo.dueDate).isSame(dayjs(), 'day'));
    const dueLaterTodos = allTodos.filter(todo => dayjs(todo.dueDate).isAfter(dayjs(), 'day'));

    console.log("My Todo-list");

    console.log("Overdue");
    if (overdueTodos.length > 0) {
        overdueTodos.forEach(todo => console.log(todo.displayableString()));
    }
    console.log("\n");

    console.log("Due Today");
    if (dueTodayTodos.length > 0) {
        dueTodayTodos.forEach(todo => console.log(todo.displayableString()));
    }
    console.log("\n");

    console.log("Due Later");
    if (dueLaterTodos.length > 0) {
        dueLaterTodos.forEach(todo => console.log(todo.displayableString()));
    }
    console.log("\n");
}

    static async overdue() {
      // Find all todos that are overdue and not completed
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
          completed: false,
        },
      });
    }

    static async dueToday() {
      // Find all todos that are due today
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
      });
    }

    static async dueLater() {
      // Find all todos that are due in the future and not completed
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          completed: false,
        },
      });
    }

    static async markAsComplete(id) {
      // Find the todo by ID and update its completed status
      return await Todo.update({ completed: true }, {
        where: { id: id }
      });
    }

    static associate(models) {
      // define association here
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      const dueDate = dayjs(this.dueDate).format('YYYY-MM-DD');
      return `${this.id}. ${checkbox} ${this.title} ${dueDate}`;
    }
  }

  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });

  return Todo;
};