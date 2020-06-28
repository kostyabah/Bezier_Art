import { h, Component } from "preact"
import "./style.less"
import { Canvas } from "../canvas/index"
import { connect } from "../mc/model-view"
import PhotoScale from "./PhotoScale";




export default connect(
    ["image", "shapes"],
    ({ photo }, state) => ({

        changeUrl : event => photo.set({src : event.target.value}),
        readFile: event => {

            event.preventDefault();
            const { files } = event.target;
            const { createObjectURL } = window.URL || window.webkit.URL
            const localImageUrl = createObjectURL(files[0]);

            return photo.set({
                src: localImageUrl
            })

        },

        onChangeScale: ({ pageX, pageY, deltaY, target }) => {
            let { position, scale } = state.image;
            scale = scale * (500 + deltaY) / 500;
            
            if (scale < 1) return;
            let { left, top } = target.parentNode.getBoundingClientRect()

            return photo.set({
                position: {
                    top: position.top + (position.top + (pageY - top)) * (deltaY) / 500,
                    left: position.left + (position.left + (pageX - left)) * (deltaY) / 500,
                },
                scale
            })
        },

        onMeasure: (elem) => {
            if (!elem) return;
            let { width, height } = elem//.getBoundingClientRect()
            return photo.set({
                size: {
                    width,
                    height
                }
            })
        }

    })
)(({ readFile, shapes, image :{position, scale, src}, ...props }) => {
    //console.log(props.size)
    return (
        <div>
            <div class="row jfy-space-around"> 
                <div class="basis-5 file">     
                    <button class="bg-olive text-white"> Фотка </button>
                    <input type="file" onChange={readFile} />
                </div>
                <button class = "basis-3" onClick={() => window.download("png")}>
                    png
                </button>
                <button class = "basis-3" onClick={() => window.download(shapes)}>
                    json
                </button>
                <input 
                    placeholder = "вставьте url фото"
                    onInput = {props.changeUrl}
                    //class = "all"
                />
            </div>
            
            <div class="flex-5 pos-r overflow-hidden" >
                <img
                    src={src} //onLoad={loadImage}
                    //ref={onMeasure}
                    class="pos-a"
                    style={{
                        height: "auto",
                        width: scale * 100 + "%",
                        top: -position.top,
                        left: -position.left
                    }}
                    //onScroll={props.onChangeTop}
                    onWheel={props.onChangeScale}
                />
            </div>
        </div>
    )
})

