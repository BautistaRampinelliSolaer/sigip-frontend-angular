import { AfterViewInit, Component, input, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-data-table',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable<T> implements AfterViewInit {
  data = input.required<T[]>();
  pageSize = input(10);
  
  dataSource = new MatTableDataSource<T>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnChanges() {
    this.dataSource.data = this.data();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
