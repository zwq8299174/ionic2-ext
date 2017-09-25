import { Injectable } from '@angular/core';
import { isPresent } from '../utils/util';

@Injectable()
export class ComponentRegistar {
  private components: any = {};

  registerComponent(component: any) {
    if (!this.isPresent(component)) {
      return;
    }
    this.components[component.name] = component;
  }

  unregisterComponent(component: any) {
    if (!this.isPresent(component)) {
      return;
    }
    delete this.components[component.name];
  }

  registerComponents(components: Array<any>) {
    if (!isPresent(components)) {
      return;
    }
    components.forEach(component => this.registerComponent(component));
  }

  unregisterComponents(components: Array<any>) {
    if (!isPresent(components)) {
      return;
    }
    components.forEach(component => this.unregisterComponent(component));
  }

  getComponent(componentname: string): any {
    return this.components[componentname];
  }

  private isPresent(component: any): boolean {
    return isPresent(component) && isPresent(component.name);
  }
}