import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { Tasks }          from './tasks';

let fixture: ComponentFixture<Tasks> = null;
let instance: any = null;
let tabName: string;

describe('Pages: Tasks', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([Tasks]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('should create the task page', async(() => {
    expect(instance).toBeTruthy();
  }));

  it('should has a tasks list', async(() => {
    expect(instance.list).toBeTruthy();
  }));

  it('should filter tasks when select a tab', async(() => {
    tabName = "TASKS.PREVIOUS";

    instance.showTasks(tabName);

    expect(instance.list).toEqual(instance.pastTasks);

    tabName = "TASKS.NEXT";

    instance.showTasks(tabName);

    expect(instance.list).toEqual(instance.tasks);
  }));
});