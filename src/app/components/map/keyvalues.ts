import {NgModule, Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'keyvalues'})
export class KeyValuesPipe implements PipeTransform {
  transform(map: Map<any, any>): any[] {
    const ret = [];

    map.forEach((value, key) => {
      ret.push({
        key: key,
        value: value
      });
    });

    return ret;
  }
}

@NgModule({
  declarations: [
    KeyValuesPipe
  ],
  exports: [
    KeyValuesPipe
  ],
  imports: []
})
export class KeyValuesModule { }
