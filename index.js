module.exports = class {

	constructor (o = {}) {

		for (const k of [
			'start', 
			'end', 
			'transform'
		]) if (k in o) this [k] = o [k]

	}

	process (src) {

		const {start, end} = this

		let from = 0, buf = ''; while (true) {

			const pos = src.indexOf (start, from); if (pos < 0) return buf + src.slice (from)

			buf += src.slice (from, pos)

			const to = src.indexOf (end, pos + 1); if (to < 0) return buf + src.slice (pos)

			buf += this.transform (src.slice (pos + start.length, to))

			from = to + end.length

		}

	}

}