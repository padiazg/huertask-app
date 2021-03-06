import { Component } from '@angular/core';
import { Task } from '../../models/task';
import { Tasks } from '../tasks/tasks';
import { TaskService } from '../../providers/task.service';
import { PersonService } from '../../providers/person.service';
import { EditTask } from '../edit-task/edit-task';
import { DuplicateTask } from '../duplicate-task/duplicate-task';

import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'task-detail',
  templateUrl: './task-detail.html'
})

export class TaskDetail {

  task = new Task();
  waitingForResponse = false
  person;

  constructor(public navCtrl: NavController, private navParams: NavParams, public taskService: TaskService, public personService: PersonService) {
    this.task = navParams.get('task');
    this.person = personService.person
  }

  togglePeopleGoing(event){
    event.target.parentElement.parentElement.classList.toggle('show_all')
  }

  deleteTask(){
    return this.taskService.deleteTask(this.task.id).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => console.log(err)
    )
  }

  going(){
    return this.taskService.going(this.task.id, this.person['id']).subscribe( data => {
      this.task = data
      console.log(data)
    },
    err => console.log(err)
    )
  }

  notGoing(){
    return this.taskService.notGoing(this.task.id, this.person['id']).subscribe( data => {
      this.task = data
      console.log(data)
    },
    err => console.log(err)
    )
  }

  toggleFinalized(task: Task){
    task.toggleFinalized()
    this.waitingForResponse = true
    task['categories'] = task['categories'].map((cat) => {return cat['id']})
    return this.taskService.editTask(task).subscribe( data => {
      this.task = data
      task['categories'] = data.categories
      this.waitingForResponse = false
    },
    err => console.log(err)
    )
  }

  goToEditTask(){
    this.navCtrl.push(EditTask, {task: this.task});
  }

  goToDuplicateTask(){
    this.navCtrl.push(DuplicateTask, {task: this.task});
  }
}
