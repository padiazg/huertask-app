import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Person } from '../models/person';
import { Community } from '../models/community';

@Injectable()
export class PersonService {
  huertaskApiUrl = 'http://huertask-dev.herokuapp.com/api';

  logged;
  person;
  communityId;

  constructor(public http: Http) { }

  instanciatedPeople(json): Person[]{
    let people = []
    for(let object in json){
      people.push(this.instanciatedPerson(json[object]))
    }
    return people
  }

  instanciatedPerson(object): Person{
    let person = new Person();
    for(let param in object){
      person[param] = object[param]
    }
    return person
  }

  instanciatedCommunity(object): Community{
    let community = new Community();
    for(let param in object){
      if(param == 'joined' || param == 'invited'){
        community[param] = this.instanciatedPeople(object[param])
      }else{
        community[param] = object[param]
      }
    }
    return community
  }

  createCommunity(community): Observable<Community>{
    let token = this.getToken();

    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Token', token);
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/communities`, community, options)
                    .map((res:Response) => <Community>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  invitePeople(invitations){
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Token', this.person['token']);

    return this.http.post(`${this.huertaskApiUrl}/communities/${this.communityId}/invite`, invitations, options)
                    .map((res:Response) => <Community>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  getCommunity(community_id): Observable<Community> {
    return this.http.get(`${this.huertaskApiUrl}/communities/${community_id}`)
      .map(res => <Community>this.instanciatedCommunity(res.json()));
  }

  logIn(person): Observable<Person>{
    this.logged = true
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    person = this.http.post(`${this.huertaskApiUrl}/login`, person, options)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
    return person
  }

  logOut(): Observable<Person>{
    this.logged = false
    return this.http.get(`${this.huertaskApiUrl}/logout`)
      .map(res => <Person>res.json());
  }

  signUp(person): Observable<Person>{
    this.logged = true
    delete person['terms']
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/signup`, person, options)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'))
  }

  resetPassword(email){
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/reset_password`, {email: email}, options)
      .map(res => <Person>this.instanciatedPerson(res.json()));
  }

  getPerson(id): Observable<Person> {
    return this.http.get(`${this.huertaskApiUrl}/people/${id}`)
      .map(res => <Person>this.instanciatedPerson(res.json()));
  }

  toggleLikeCategory(user, category){
    if (category.fav){
      return this.dislikeCategory(user.id, category.id)
    } else {
      return this.likeCategory(user.id, category.id)
    }
  }

  likeCategory(user_id, category_id): Observable<Person> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/people/${user_id}/categories/${category_id}`, "", options)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  dislikeCategory(user_id, category_id): Observable<Person> {
    return this.http.delete(`${this.huertaskApiUrl}/people/${user_id}/categories/${category_id}`)
                    .map((res:Response) => <Person>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getToken(){
    return this.person ? this.person['token'] : "";
  }

}

@Injectable()
export class PersonServiceMock {
  person;
  json = {
    "id": 1,
    "name": "Persona 1",
    "categories": []
  }

  constructor(){
    this.person = this.instanciatedPerson(this.json);
  }

  instanciatedPerson(object): Person{
    let person = new Person();
    for(let param in object){
      person[param] = object[param]
    }
    return person
  }

  getPerson(id): Observable<Person> {
    return Observable.of(this.person);
  }
}
