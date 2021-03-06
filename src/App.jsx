import React, { Component } from 'react';

import './App.css';
import Header from './components/Header';
import TodoList from './components/TodoList';
import SearchItemForm from './components/SearchItemForm';
import Filters from './components/Filters';
import Counters from './components/Counters';
import PopUp from './components/PopUp';
import NoTask from './components/NoTask';
import Button from './components/Button';

// ADD PROP-TYPES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

class App extends Component {
   constructor() {
      super();

      // start value for creating id
      this.idCount = 100;

      this.state = {
         todosArr: [],
         searchVal: '',
         filter: 'all',
         showPopUp: false
      };
   }

   componentDidMount = () => {
      const itemsFromLocalStorage = window.localStorage.getItem("items");
      const items = JSON.parse(itemsFromLocalStorage);

      if (items) {
         this.setState({
            todosArr: items
         });
      }
   }

   componentDidUpdate = () => {
      const itemsJSON = JSON.stringify(this.state.todosArr);
      window.localStorage.setItem("items", itemsJSON);
   }

   // create todo-item
   createTodoItem = (text) => ({
      id: ++this.idCount,
      label: text,
      important: false,
      done: false
   });

   // add todo-item
   addTodoItem = (label) => {
      if (label) {
         this.setState(({ todosArr, showPopUp }) => {
            const newTodoItem = this.createTodoItem(label);
            const newTodosArr = [...todosArr, newTodoItem];

            return {
               todosArr: newTodosArr,
               showPopUp: !showPopUp
            };
         });
      }
   };

   // delete todo-item
   deleteTodoItem = (id) => {
      this.setState(({ todosArr }) => {
         const newTodosArr = todosArr.filter((todoItem) => todoItem.id !== id);

         return {
            todosArr: newTodosArr
         };
      });
   };

   // change a name of todo-item for searching
   onChangeSearchVal = (newSearchVal) => {
      this.setState({
         searchVal: newSearchVal
      });
   };

   // search todo-item
   searchTodoItem = (todosArr, searchVal) => {
      const visibleTodoItems = todosArr.filter((todoItem) => {
         return todoItem.label.toLowerCase()
            .indexOf(searchVal.toLowerCase()) > - 1;
      });

      return visibleTodoItems;
   };

   // change a value of filter
   onChangeFilterVal = (newFilterVal) => {
      this.setState({
         filter: newFilterVal
      });
   };

   // filter todo-item
   filterTodoItem = (todosArr, filter) => {
      switch (filter) {
         case 'active':
            return todosArr.filter((todoItem) => todoItem.done === false);
         case 'done':
            return todosArr.filter((todoItem) => todoItem.done);
         default:
            return todosArr;
      }
   };

   // toggle a value of propName for todo-item in this.state.todosArr
   toggleProperties = (id, propName) => {
      this.setState(({ todosArr }) => {
         const indexOfTodoItem = todosArr.findIndex((todoItem) => todoItem.id === id);
         const oldTodoItem = todosArr[indexOfTodoItem];
         const newTodoItem = { ...oldTodoItem, [propName]: !oldTodoItem[propName] };
         const arrBeforeOldTodoItem = todosArr.slice(0, indexOfTodoItem);
         const arrAfterOldTodoItem = todosArr.slice(indexOfTodoItem + 1);

         return {
            todosArr: [
               ...arrBeforeOldTodoItem,
               newTodoItem,
               ...arrAfterOldTodoItem]
         };
      });
   };

   // toggle a value of property 'important' of todo-item
   onToggleImportant = (id) => {
      this.toggleProperties(id, 'important');
   }

   // toggle a value of property 'done' of todo-item 
   onToggleDone = (id) => {
      this.toggleProperties(id, 'done');
   }

   // toggle popup
   togglePopUp = () => {
      this.setState(({ showPopUp }) => {
         return {
            showPopUp: !showPopUp
         }
      });
   }

   render() {
      const { todosArr, searchVal, filter, showPopUp } = this.state;
      const noTask = todosArr.length ? null : <NoTask />;
      const todoList = !todosArr.length ? null : (
         <TodoList
            todosArr={todosArr}
            searchVal={searchVal}
            filter={filter}
            onDeleteTodoItem={this.deleteTodoItem}
            onToggleImportant={this.onToggleImportant}
            onToggleDone={this.onToggleDone}
            onSearchTodoItem={this.searchTodoItem}
            onFilterTodoItem={this.filterTodoItem}
         />
      );

      return (
         <div className="app" basename="/todolist-v2">
            <Header />
            <div className="app-panel">
               <SearchItemForm
                  onChangeSearchVal={this.onChangeSearchVal}
               />
               <Filters
                  onChangeFilterVal={this.onChangeFilterVal} filter={filter}
               />
            </div>
            {noTask}
            {todoList}
            <Counters todosArr={todosArr} />
            <Button
               title="Add task"
               onTogglePopUp={this.togglePopUp}
            />
            {
               showPopUp &&
               <PopUp
                  onTogglePopUp={this.togglePopUp}
                  onAddTodoItem={this.addTodoItem}
               />
            }
         </div >
      );
   }
}

export default App;