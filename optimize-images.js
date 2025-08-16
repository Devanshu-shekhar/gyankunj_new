import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";

const run = async () => {
  await imagemin(["public/images/*.{jpg,png,svg}"], {
    destination: "public/images-optimized",
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] }),
      imageminSvgo()
    ],
  });

  console.log("✅ Images optimized and saved in public/images-optimized");
};

run();
