const Replacer = require ('..')

const val = {one: 1, two: 2}

function tst (rpl) {

	expect (rpl.process ('')).toBe ('')

	expect (rpl.process ('***')).toBe ('***')

	expect (rpl.process ('<*~one*> and <*~two*> makes 3.')).toBe ('1 and 2 makes 3.')

	expect (rpl.process ('All for <*~one*><*~')).toBe ('All for 1<*~')

	expect (rpl.process ('*>*>')).toBe ('*>*>')

}

test ('basic', () => {

	const rpl = new Replacer ({
		start     : '<*~',
		end       :  '*>',
		transform : _ => val [_]	
	})

	tst (rpl)

})

test ('subclass 1', () => {

	const clazz = class extends Replacer {

		constructor () {
			super ()
			this.start = '<*~'
			this.end   =  '*>'
		}

		transform (_) { return val [_]}

	}

	const rpl = new clazz ()

	tst (rpl)

})

test ('subclass 2', () => {

	const rpl = new (class extends Replacer {
		get start  () {return '<*~'}
		get end    () {return '*>'}
		transform (_) { return val [_]}
	})

	tst (rpl)

})