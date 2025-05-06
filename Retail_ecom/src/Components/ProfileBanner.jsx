import profileimg from "../assets/maskable-icon.png";

const ProfileBanner = ({ first_name, last_name, email, mobile }) => {
  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.5)",
      }}
      className="hidden lg:flex justify-left items-center h-[240px] "
    >
      <div className="h-[120px] w-[120px]  ml-[20px] border-4 rounded-full">
        <img
          src={profileimg}
          alt="profileimg"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="h-[120px]  ml-[20px] flex flex-col justify-center items-left text-white ">
        <p className="text-lg font-semibold">
          {first_name} &nbsp;
          {last_name}
        </p>
        <p className="text-sm">{email}</p>
        <p className="text-sm">Contact: {mobile}</p>
      </div>
    </div>
  );
};

export default ProfileBanner;
