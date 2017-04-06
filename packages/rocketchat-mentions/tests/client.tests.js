/* eslint-env mocha */
import assert from 'assert';

import Mentions from '../Mentions';
const mention = new Mentions({
	pattern: '[0-9a-zA-Z-_.]+',
	me: () => 'me'
});

describe('Mention', function() {
	describe('get pattern', () => {
		const regexp = '[0-9a-zA-Z-_.]+';
		describe('by function', function functionName() {
			before(() => mention.pattern = () => regexp);
			it(`should be equal to ${ regexp }`, ()=> {
				assert.equal(regexp, mention.pattern);
			});
		});
		describe('by const', function functionName() {
			before(() => mention.pattern = regexp);
			it(`should be equal to ${ regexp }`, ()=> {
				assert.equal(regexp, mention.pattern);
			});
		});
	});
	describe('get me', () => {
		const me = 'me';
		describe('by function', function functionName() {
			before(() => mention.me = () => me);
			it(`should be equal to ${ me }`, ()=> {
				assert.equal(me, mention.me);
			});
		});
		describe('by const', function functionName() {
			before(() => mention.me = me);
			it(`should be equal to ${ me }`, ()=> {
				assert.equal(me, mention.me);
			});
		});
	});
	describe('getUserMentions', function functionName() {
		describe('for simple text, no mentions', () => {
			const result = [];
			[
				'#rocket.cat',
				'hello rocket.cat how are you?'
			]
			.forEach(text => {
				it(`should return "${ JSON.stringify(result) }" from "${ text }"`, () => {
					assert.deepEqual(result, mention.getUserMentions(text));
				});
			});
		});
		describe('for one user', () => {
			const result = ['@rocket.cat'];
			[
				'@rocket.cat',
				' @rocket.cat ',
				'hello @rocket.cat',
				'hello,@rocket.cat',
				'@rocket.cat, hello',
				'@rocket.cat,hello',
				'hello @rocket.cat how are you?'
			]
			.forEach(text => {
				it(`should return "${ JSON.stringify(result) }" from "${ text }"`, () => {
					assert.deepEqual(result, mention.getUserMentions(text));
				});
			});
			it.skip('shoud return without the "." from "@rocket.cat."', () => {
				assert.deepEqual(result, mention.getUserMentions('@rocket.cat.'));
			});
			it.skip('shoud return without the "_" from "@rocket.cat_"', () => {
				assert.deepEqual(result, mention.getUserMentions('@rocket.cat_'));
			});
			it.skip('shoud return without the "-" from "@rocket.cat."', () => {
				assert.deepEqual(result, mention.getUserMentions('@rocket.cat-'));
			});
		});
		describe('for two users', () => {
			const result = ['@rocket.cat', '@all'];
			[
				'@rocket.cat @all',
				' @rocket.cat @all ',
				'hello @rocket.cat and @all',
				'@rocket.cat, hello @all',
				'hello @rocket.cat and @all how are you?'
			]
			.forEach(text => {
				it(`should return "${ JSON.stringify(result) }" from "${ text }"`, () => {
					assert.deepEqual(result, mention.getUserMentions(text));
				});
			});
		});
	});

	describe('getChannelMentions', function functionName() {
		describe('for simple text, no mentions', () => {
			const result = [];
			[
				'@rocket.cat',
				'hello rocket.cat how are you?'
			]
			.forEach(text => {
				it(`should return "${ JSON.stringify(result) }" from "${ text }"`, () => {
					assert.deepEqual(result, mention.getChannelMentions(text));
				});
			});
		});
		describe('for one channel', () => {
			const result = ['#general'];
			[
				'#general',
				' #general ',
				'hello #general',
				'#general, hello',
				'hello #general, how are you?'
			].forEach(text => {
				it(`should return "${ JSON.stringify(result) }" from "${ text }"`, () => {
					assert.deepEqual(result, mention.getChannelMentions(text));
				});
			});
			it.skip('shoud return without the "." from "#general."', () => {
				assert.deepEqual(result, mention.getUserMentions('#general.'));
			});
			it.skip('shoud return without the "_" from "#general_"', () => {
				assert.deepEqual(result, mention.getUserMentions('#general_'));
			});
			it.skip('shoud return without the "-" from "#general."', () => {
				assert.deepEqual(result, mention.getUserMentions('#general-'));
			});
		});
		describe('for two channels', () => {
			const result = ['#general', '#other'];
			[
				'#general #other',
				' #general #other',
				'hello #general and #other',
				'#general, hello #other',
				'hello #general #other, how are you?'
			].forEach(text => {
				it(`should return "${ JSON.stringify(result) }" from "${ text }"`, () => {
					assert.deepEqual(result, mention.getChannelMentions(text));
				});
			});
		});

	});

});
const message = {
	mentions:[{username:'rocket.cat'}, {username:'admin'}, {username: 'me'}],
	channels: [{name: 'general'}, {name: 'rocket.cat'}]
};
describe('replace methods', function() {
	describe('replaceUsers', () => {
		it('shoud render for @all', () => {
			const result = mention.replaceUsers('@all', message, 'me');
			assert.equal('<a class="mention-link mention-link-me mention-link-all background-attention-color">@all</a>', result);
		});
		const str2 = '@rocket.cat';
		it(`shoud render for ${ str2 }`, () => {
			const result = mention.replaceUsers('@rocket.cat', message, 'me');
			assert.equal(result, `<a class="mention-link " data-username="${ str2.replace('@', '') }">${ str2 }</a>`);
		});

		it(`shoud render for "hello ${ str2 }"`, () => {
			const result = mention.replaceUsers(`hello ${ str2 }`, message, 'me');
			assert.equal(result, `hello <a class="mention-link " data-username="${ str2.replace('@', '') }">${ str2 }</a>`);
		});
		it('shoud render for unknow/private user "hello @unknow"', () => {
			const result = mention.replaceUsers('hello @unknow', message, 'me');
			assert.equal(result, 'hello @unknow');
		});
		it('shoud render for me', () => {
			const result = mention.replaceUsers('hello @me', message, 'me');
			assert.equal(result, 'hello <a class="mention-link mention-link-me background-primary-action-color" data-username="me">@me</a>');
		});
	});
	describe('replaceChannels', () => {
		it('shoud render for #general', () => {
			const result = mention.replaceChannels('#general', message, 'me');
			assert.equal('<a class="mention-link" data-channel="general">#general</a>', result);
		});
		const str2 = '#rocket.cat';
		it(`shoud render for ${ str2 }`, () => {
			const result = mention.replaceChannels(str2, message, 'me');
			assert.equal(result, `<a class="mention-link" data-channel="${ str2.replace('#', '') }">${ str2 }</a>`);
		});
		it(`shoud render for "hello ${ str2 }"`, () => {
			const result = mention.replaceChannels(`hello ${ str2 }`, message, 'me');
			assert.equal(result, `hello <a class="mention-link" data-channel="${ str2.replace('#', '') }">${ str2 }</a>`);
		});
		it('shoud render for unknow/private channel "hello #unknow"', () => {
			const result = mention.replaceChannels('hello #unknow', message, 'me');
			assert.equal(result, 'hello #unknow');
		});
	});
	describe('parse all', () => {
		it('shoud render for #general', () => {
			message.html = '#general';
			const result = mention.parse(message, 'me');
			assert.equal('<a class="mention-link" data-channel="general">#general</a>', result.html);
		});
		it('shoud render for "#general and @rocket.cat', () => {
			message.html = '#general and @rocket.cat';
			const result = mention.parse(message, 'me');
			assert.equal('<a class="mention-link" data-channel="general">#general</a> and <a class="mention-link " data-username="rocket.cat">@rocket.cat</a>', result.html);
		});
		it('shoud render for "', () => {
			message.html = '';
			const result = mention.parse(message, 'me');
			assert.equal('', result.html);
		});
		it('shoud render for "simple text', () => {
			message.html = 'simple text';
			const result = mention.parse(message, 'me');
			assert.equal('simple text', result.html);
		});

	});
});
