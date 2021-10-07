// import { mapDataTree } from './dataTree.service';

import { GetDataTreeQuery } from 'types';

export enum Folder {
  tables = 'tables',
  views = 'views',
  routines = 'routines',
  triggers = 'triggers',
  aggregates = 'aggregates',
}

export type ServerTree = GetDataTreeQuery['server'];
export type DatabaseTree = ServerTree['databases'][number];
export type SchemaTree = DatabaseTree['schemas'][number];
export type TableTree = SchemaTree['tables'][number];
export type ViewTree = SchemaTree['views'][number];
export type Column = TableTree['columns'][number];
export type Index = TableTree['indices'][number];
export type Constraint = TableTree['constraints'][number];
export type ForeignKey = TableTree['foreignKeys'][number];
export type TableTrigger = TableTree['triggers'][number];
export type Procedure = SchemaTree['procedures'][number];
