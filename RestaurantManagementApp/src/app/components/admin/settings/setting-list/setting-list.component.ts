import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';

import {Setting} from '../../../../models/setting.model';

@Component({
  selector: 'app-setting-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.scss']
})
export class SettingListComponent implements OnInit {
  setting: Setting;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: Data) => this.setting = data['settings']);
  }

}
