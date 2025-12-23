const Preloader = () => {
  return (
    <div className="preloader">
      <div className="loader">
        <div className="logo-preloader">
          <img 
            src="/assets/images/logo/logo.svg" 
            alt="Bello Food Logo" 
            className="preloader-logo"
          />
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Preloader;
