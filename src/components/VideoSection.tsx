
import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayVideo = () => {
    setIsPlaying(true);
  };
  
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Watch Our <span className="highlight">Demo</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how our digital products can transform your business and boost your productivity.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            {!isPlaying ? (
              <>
                <img 
                  src="https://i.vimeocdn.com/video/1842117466-fdfffd5a7ef4404ba2195ae6e4316c7824f3b0d44fbeb2192f54f622708f9de3-d?mw=1000&mh=563&q=70" 
                  alt="Video thumbnail" 
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <motion.button 
                    className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white text-white hover:scale-110 transition-transform"
                    onClick={handlePlayVideo}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PlayCircle className="h-12 w-12 fill-white" />
                  </motion.button>
                </div>
              </>
            ) : (
              <iframe 
                width="100%" 
                height="500" 
                src="https://i.vimeocdn.com/video/1842117466-fdfffd5a7ef4404ba2195ae6e4316c7824f3b0d44fbeb2192f54f622708f9de3-d?mw=1000&mh=563&q=70" 
                title="Product Demo Video"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="aspect-video"
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
