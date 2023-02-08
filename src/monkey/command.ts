import { MonkeyCallback } from '..';

export default class Command {
  public command: string;
  public callback: MonkeyCallback;
  public next?: MonkeyCallback;
  constructor(command: string, callback: MonkeyCallback) {
    this.callback = callback;
    this.command = command;
  }
}
