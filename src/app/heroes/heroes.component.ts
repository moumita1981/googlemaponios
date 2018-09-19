import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { FarmService } from '../farm.service';
//import * as jquery from 'jquery';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  tableData: any;

  constructor(private heroService: HeroService, private farmService: FarmService) { }

  ngOnInit() {
    this.getHeroes();
    this.tableData = this.farmService.getTableData();
    //this.loadTable();
    console.log('this.tableData', this.tableData);
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

  private loadTable() {
    let that = this;
    let columns = [
        {
            field: 'name', align: 'center', 
            valign: 'middle'
        },
        {
          field: 'organisation', align: 'center',
          valign: 'middle'
      },
      {
        field: 'post', align: 'center', 
        valign: 'middle'
    }
       
    ];
    $('#tasklistTable').bootstrapTable({
        striped: false,
        smartDisplay: true,
        clickToSelect: true,
        maintainSelected: true,
        singleSelect: true,
        search: false,
        columns
    });
    $('#tasklistTable').bootstrapTable('load', this.tableData);
   
}
}
