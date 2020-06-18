import { h, Component, render, cloneElement } from 'preact'
import dataStore from './store'
import { decoration } from './util';


let decorActions = (actions, setState) => {
    let wrapper = action => (...args) =>{
        console.groupEnd(`----------${action.name}------------`)
        
        let result = action(...args)
        
        if (Array.isArray(result)) {
            let start = result.shift()
            let { url, ...part } = start
            let quereRun = data => result.reduce((acc, func) => func(acc), data)
            fetch(url || start, url ? part : null)
                .then(res => {
                    try {
                        return res.json()
                    } catch (e) {
                        return res.text()
                    }
                })
                .then(quereRun)
                .then(setState)
        } else {

            setState(result, args, action.name)
        }
    }

    return decoration(actions, wrapper)
}

let createStore = ([state, getter, changer]) => {
    let getComputedState =()=>({
        ...state,
        ...getter(state)
    });
    let listeners = [], 
        stack = [], 
        computedWithState = getComputedState();
    //let changer = change(state)
    console.log(computedWithState) 
    let setState = (partState, args, nameMethod) => {
        if (typeof partState === "function") {
            partState = partState(computedWithState)
        }
        //console.log(partState)
        console.groupCollapsed([
            nameMethod, [...args],
            "result", partState
        ])
        state = {
            ...state,
            ...partState
        }

        computedWithState = getComputedState();
        //middleware = actions(state);
        //changer = change(state)
        stack = [];
        //console.log(state)
        //console.log("setState")
        for (let listen of listeners) {
            if (!stack.includes(listen))
                listen.update()
        }

    }
    let addToStack = (listen) => {
        stack.push(listen)
    }
    let subscribe = (listen) => {
        listeners.push(listen)
        return () => {
            let index = listeners.indexOf(listen)
            listeners.splice(index, 1)
        }
    }

    

    let getState = (selector = []) => selector.reduce(
        (acc, key) => ({
            ...acc,
            [key]: computedWithState[key] 
        }),
        {} 
    )
    let getChanger = (on, _data) => on
        ? decorActions(on(changer, _data), setState) : {}
    return { addToStack, subscribe, getState, getChanger }
}

let store = createStore(dataStore)

function plosk(next, prev) {
    return next !== prev
}

function shallow(prev, next, depth = 1) {
    let type = typeof prev;
    if (type !== typeof next) return true;
    if (type !== "object" || depth == 0) return plosk(prev, next)

    if (Object.keys(next).length !== Object.keys(prev).length) {
        return true
    }

    for (let key in prev) {
        if (shallow(prev[key], next[key], depth - 1)) {
            console.log([key, prev[key], next[key]])
            return true
        }
    }
    console.log("not change", next)
    return false
}




export class Rdx extends Component {

    static getDerivedStateFromProps(props) {
        let res = store.getState(props.getter)
        console.log(res);
        return res;
    }

    constructor(props) {
        super(props)
        //this.state = getState(store.merging())
        if (props.getter) {
            this.unscribe = store.subscribe(this)
        }

    }

    shouldComponentUpdate(props, state) {
        //console.log(state, this.state)

        return shallow(this.state, state)
        //&& isUpdate(props, this.props)
    }
    update() {
        let newState = store.getState(this.props.getter)
        console.log(newState)
        this.setState(newState)
    }

    componentDidUpdate() {
        store.addToStack(this)
    }

    componentWillUnmount() {
        this.unscribe && this.unscribe()
    }

    render({ getter, on, children, ...props }) {
        let actions = store.getChanger(on, this.state)
        let render = children(this.state, actions)


        console.log(props, render, this.state)
        return render && cloneElement(render, props)
    }
}


export let connect = (
    getState = [],
    getActions = (store) => ({}),
) =>
    (template) => {

        return class extends Component {


            render(props) {
                return (
                    <Rdx
                        getter={getState}
                        on={getActions}
                        {...props}
                    >
                        {(state, action) => template({ ...{ ...state, ...action } })}
                    </Rdx>
                )
            }
        }
    }



