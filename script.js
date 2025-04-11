import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

const canvas = document.getElementById("complex-plane")
const context = canvas.getContext("2d")

const canvas2 = document.getElementById("complex-axis")
const axis = canvas2.getContext("2d")

const ui = new GUI()

const max_iterations = 200

let controls = {
    'real': 0, 
    'imaginary': 0, 
    'escape radius': 3, 
    'scale': 1,
    'x': 0,
    'y': 0,
    'generate': function(){ run() },
    'download': function(){ download() }
}

const complex_constant_folder = ui.addFolder('complex_constant')
complex_constant_folder.add( controls, 'real', -3, 3, 0.001)
complex_constant_folder.add( controls, 'imaginary', -3, 3, 0.001)

const settings_folder = ui.addFolder('settings')
settings_folder.add( controls, 'escape radius', 0, 4, 1 )
settings_folder.add( controls, 'scale', 
    {'5': 1, '2.5': 2, '1': 5, '0.5': 10, '0.1': 50, '0.05': 100}
)

const zoom_folder = ui.addFolder('focal point')
zoom_folder.add( controls, 'x', -1, 1, 0.001 )
zoom_folder.add( controls, 'y', -1, 1, 0.001 )

const generateButton = ui.add( controls, 'generate' )
const downloadButton = ui.add( controls, 'download' )

function drawAxis()
{
    const scale = { ...controls }['scale']
    axis.clearRect(0, 0, 1100, 1100)
    axis.fillStyle = "rgb(0, 0, 0)"

    axis.moveTo(0, 1010)
    axis.lineTo(1000, 1010)
    axis.moveTo(1010, 0)
    axis.lineTo(1010, 1000)
    axis.font = "18px arial"

    for (let i = 0; i <= 10; i += 2.5)
    {
        const tick = (i-5)/scale
        const x = i*100
        axis.moveTo(x, 1010)
        axis.lineTo(x, 1020)
        axis.fillText(tick, x-5, 1040)

        axis.moveTo(1010, x)
        axis.lineTo(1020, x)
        axis.fillText(tick, 1025, x+5)
    }
    axis.stroke()
}

function run()
{
    context.fillStyle = "#FFFFFF"
    context.fillRect(0, 0, 1000, 1000)
    const complex_constant = { ...controls }
    const cr = complex_constant['real']
    const ci = complex_constant['imaginary']
    const x = complex_constant['x']
    const y = complex_constant['y']
    const scale = complex_constant['scale']*100
    const escape_radius_square = Math.pow(controls['escape radius'], 2)
    console.log(complex_constant)

    //generateButton.disabled()
    for (let i = 0; i < 1000; i ++)
    {
        for (let j = 0; j < 1000; j ++)
        {
            let zr = (i-500)/scale + x
            let zi = (j-500)/scale + y
            let zrs = Math.pow(zr, 2)
            let zis = Math.pow(zi, 2)
            let temp = zr*zi

            for (let t = 0; t < max_iterations; t++)
            {
                if ( ( zrs + zis ) >= escape_radius_square )
                {
                    const newT = t + 1 - Math.log(Math.log(zrs + zis))/Math.log(2)
                    context.fillStyle = `rgb(${newT*2},${newT*3},${newT*1.5})`
                    context.fillRect(i, j, 1, 1)
                    break
                }
                
                zr = ( (zrs - zis ) + cr )
                zi = ( (2*temp) + ci )
                temp = zr*zi
                zrs = Math.pow(zr, 2)
                zis = Math.pow(zi, 2)
            }
            
        }
    }

    drawAxis()
}

function download()
{
    const image = canvas.toDataURL("image/jpeg")
    const aDownloadLink = document.createElement('a');

    const complex_constant = { ...controls }
    const cr = complex_constant['real']
    const ci = complex_constant['imaginary']
    const x = complex_constant['x']
    const y = complex_constant['y']
    const scale = complex_constant['scale']

    aDownloadLink.download = `r${cr}_i${ci}_at_x${x}_y${y}_res${scale}.png`;
    aDownloadLink.href = image;
    aDownloadLink.click();
}

window.onload = () => {
    run()
}
