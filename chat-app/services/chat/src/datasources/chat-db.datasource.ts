import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'test_chat',
  connector: 'postgresql',
  url: 'postgres://postgres:saurabh99@localhost/test_chat',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'saurabh99',
  database: 'test_chat',
  schema: process.env.DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class ChatDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'chatDb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.chatDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}