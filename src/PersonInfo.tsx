type Props = {
  data: {
    firstNameLastName: string;
    jobTitle: string;
    emailAddress: string;
  };
  onClick: () => void;
  selected: boolean;
};

function PersonInfo(props: Props) {
  const { data, onClick, selected } = props;
  return (
    <button
      onClick={onClick}
      style={
        selected
          ? {
              outline: "2px solid green",
            }
          : {}
      }
      className="person-info"
    >
      <div className="firstNameLastName">{data.firstNameLastName}</div>
      <div className="jobTitle">{data.jobTitle}</div>
      <div className="emailAddress">{data.emailAddress}</div>
    </button>
  );
}

export default PersonInfo;
