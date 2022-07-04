import MockCommand from '../mockery/mockCommand';
import Connection from '../lib/connection';
import Parser from '../lib/parser';

describe('Constructor tests', () => {
    it('Test parser', () => {
        const connection = new Connection();
        const cmd = new MockCommand(connection);
        expect(cmd.parser).toBeInstanceOf(Parser);
    });
    it('Test connection', () => {
        const connection = new Connection();
        const cmd = new MockCommand(connection);
        expect(cmd.connection).toBeInstanceOf(Connection);
    });
});
describe('Escape tests', () => {
    const connection = new Connection();
    const cmd = new MockCommand(connection);
    it('escape undefined', () => {
        const result = cmd.escape(undefined);
        expect(result).toBe('');
    });
    it('escape string', () => {
        const result = cmd.escape("'test'");
        expect(result).toBe(`''"'"'test'"'"''`);
    });
    it('escape number', () => {
        const result = cmd.escape(1);
        expect(result).toBe(`${1}`);
    });
    it('escape null', () => {
        const result = cmd.escape(null);
        expect(result).toBe(`${null}`);
    });
    it('escape bool', () => {
        const result = cmd.escape(true);
        expect(result).toBe(`${true}`);
    });
});

describe('Escape compat tests', () => {
    const connection = new Connection();
    const cmd = new MockCommand(connection);
    it('escape undefined', () => {
        const result = cmd.escapeCompat(undefined);
        expect(result).toBe('');
    });
    it('escape string', () => {
        const result = cmd.escapeCompat('"test"');
        expect(result).toBe('"\\"test\\""');
    });
    it('escape number', () => {
        const result = cmd.escapeCompat(1);
        expect(result).toBe(`${1}`);
    });
    it('escape null', () => {
        const result = cmd.escapeCompat(null);
        expect(result).toBe(`${null}`);
    });
    it('escape bool', () => {
        const result = cmd.escapeCompat(true);
        expect(result).toBe(`${true}`);
    });
});
