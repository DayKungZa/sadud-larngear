export default async function randomColor() {


    return await Math.round( await Math.random()*255);
}