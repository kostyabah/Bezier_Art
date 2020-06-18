import { h, Component } from 'preact'


import Holst from "./view/Holst"
import PhotoView from "./view/PhotoView"
import ListTool from "./view/ListTool"
import Palitra from "./view/Palitra"
import { Range, ColorPicker } from "./view/ChooseColor"

export default () => (
    <div class="w-100 h-100 row">
        <ListTool class="flex-1" width={150} />
        <div class="flex-4 col" >
            <Holst class="flex-1" />
            <Palitra class="flex-0" />
        </div>

        <div class="flex-2 col">
            <PhotoView class="flex-2 col" />
            <ColorPicker class="flex-1" />
        </div>
    </div>

)
