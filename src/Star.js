import { Component } from 'preact'
import { start } from 'repl';


export class extends Component {
	componentWillMount({ star }) {
		star._phanats.push(this)
	}
	render() { return this.props.children }
}

function Star(data) {
	var getter = function (key, value) {

		if (typeof data[key] == 'function') {
			return function () {
				value.apply(data, arguments)
			}
		} else {
			return function () {
				return value;
			}
		}

	}
	var setter = function (key) {

		return function (value) {
			if (typeof value == 'function') {
				//var method = value.bind(this.data);
				data[key] = function () {
					value.apply(data, arguments);
					this._render();
				}
			} else {
				data[key] = value;
			}

			this._update();
		}
	}

	return Object.entries(data).reduce((res, [key, value]) => {
		return Object.defineProperty(res, key, {
			get: getter(key, value),
			set: setter(key, value)
		})
	}, {
			_phanats: [],
			_update() {
				this._phanats.forEach(phanat => {
					phanat.forceUpdate()
				});
			}
		});
}