import React, { useContext, useEffect, useState } from "react";
import "./SymptomLogPage.css";

import { ThemeContext } from "../../context/ThemeContext";
import CustomCard from "../../components/customStyles/CustomCard";
import CustomPage from "../../components/customStyles/CustomPage";
import SymptomSlider from "./components/SymptomSlider";
import { Link, useHistory } from "react-router-dom";
import httpClient from "../../lib/httpClient";
import { SnackbarContext } from "../../context/SnackbarContext";
import { AuthContext } from "../../context/AuthContext";
import { Skeleton } from "@material-ui/lab";
import {
  endOfWeek,
  formattedDay,
  getDayOfWeek,
  getFirstDayOfWeek,
} from "../../lib/getFirstDayOfWeek";
import { Button } from "@material-ui/core";
import CustomButton from "../../components/customStyles/CustomButton";

export default function SymptomLogPage() {
  const authContext = useContext(AuthContext);
  const snackbarContext = useContext(SnackbarContext);

  const themeContext = useContext(ThemeContext);
  const theme = themeContext.enableDarkMode
    ? themeContext.dark
    : themeContext.light;

  // START OF symptoms
  //What are your symptoms?
  const [pain, setPain] = useState();
  const [fatigue, setFatigue] = useState();
  const [nausea, setNausea] = useState();
  const [disturbedSleep, setDisturbedSleep] = useState();
  const [anxietyOrNervousness, setAnxietyOrNervousness] = useState();
  const [shortnessOfBreath, setShortnessOfBreath] = useState();
  const [cantRememberThings, setCantRememberThings] = useState();
  const [lackOfAppetite, setLackOfAppetite] = useState();
  const [drowsy, setDrowsy] = useState();
  const [sadness, setSadness] = useState();
  const [vomit, setVomit] = useState();
  const [numbnessOrTingling, setNumbnessOrTingling] = useState();

  //Have your symptoms interfered with your activities?
  const [generalActivity, setGeneralActivity] = useState();
  const [mood, setMood] = useState();
  const [work, setWork] = useState();
  const [relationWithOthers, setRelationWithOthers] = useState();
  const [walking, setWalking] = useState();
  const [enjoymentOfLife, setEnjoymentOfLife] = useState();

  //What do you think about the exercise plan in the last week?
  const [difficultyLevel, setDifficultyLevel] = useState();
  // END OF symptoms

  const history = useHistory();
  //CHECK
  const [loading, setLoading] = useState();
  const [hasActivities, setHasActivities] = useState();
  const [statusMessage, setStatusMessage] = useState();

  const [isWeekend, setIsWeekend] = useState(false);

  // const [loadingStatusCheck, setLoadingStatusCheck] = useState(false);
  // const [statusCheck, setStatusCheck] = useState();
  // const [statusMessage, setStatusMessage] = useState();

  useEffect(() => {
    // setStatusCheck(false);
    checkWeek();
  }, []);

  const checkWeek = async () => {
    setLoading(true);
    console.log("checkWeek");
    await httpClient()
      .post(`/symptoms/checkWeek`, {
        userId: authContext.user?.id || authContext.user?._id,
        startDay: formattedDay(getFirstDayOfWeek()),
      })
      .then((res) => {
        console.log("Check", res.data.length > 0 ? true : false, res.data);
        if (!res.data.length > 0) {
          console.log("BIG TRUE");
          setHasActivities(false);
          if (
            formattedDay(endOfWeek(getFirstDayOfWeek())) ===
            formattedDay(new Date())
          ) {
            setIsWeekend(true);
          } else {
            setIsWeekend(false);
          }
        } else {
          if (
            formattedDay(endOfWeek(getFirstDayOfWeek())) ===
            formattedDay(new Date())
          ) {
            setIsWeekend(true);
          } else {
            setIsWeekend(false);
          }
          setHasActivities(true);
        }
        setStatusMessage(res.data?.error);

        setLoading(false);
      })
      .catch((err) => {
        setHasActivities(false);
        setLoading(false);
        console.log(" ========= >>>>>> SymptomLogPage : CATCh", err);
      });
  };

  const [loadingActivity, setLoadingActivity] = useState();
  const addActivity = () => {
    if (
      pain === undefined ||
      fatigue === undefined ||
      nausea === undefined ||
      disturbedSleep === undefined ||
      anxietyOrNervousness === undefined ||
      shortnessOfBreath === undefined ||
      cantRememberThings === undefined ||
      lackOfAppetite === undefined ||
      drowsy === undefined ||
      sadness === undefined ||
      vomit === undefined ||
      numbnessOrTingling === undefined ||
      generalActivity === undefined ||
      mood === undefined ||
      work === undefined ||
      relationWithOthers === undefined ||
      walking === undefined ||
      enjoymentOfLife === undefined ||
      difficultyLevel === undefined
    ) {
      snackbarContext.Message("Please select your exercise plan", "info");
      setLoadingActivity(false);
    } else {
      setLoadingActivity(true);
      console.log(getFirstDayOfWeek());
      httpClient()
        .post(`/symptoms`, {
          userId: authContext.user?.id || authContext.user?._id,
          startDay: formattedDay(getFirstDayOfWeek()),

          pain: pain,
          fatigue: fatigue,
          nausea: nausea,
          disturbedSleep: disturbedSleep,
          anxiety: anxietyOrNervousness,
          shortnessOfBreath: shortnessOfBreath,
          cantRememberThings: cantRememberThings,
          lackOfAppetite: lackOfAppetite,
          drowsy: drowsy,
          sadness: sadness,
          vomit: vomit,
          numbnessOrTingling: numbnessOrTingling,

          generalActivity: generalActivity,
          mood: mood,
          work: work,
          relationWithOthers: relationWithOthers,
          walking: walking,
          enjoymentOfLife: enjoymentOfLife,

          difficultyLevel: difficultyLevel,
        })
        .then(({ data }) => {
          console.log("Symptoms Added", data);
          snackbarContext.Message("Symptoms added successfully", "success");
          checkWeek();
          history.push("/");

          setLoadingActivity(false);
        })
        .catch((err) => {
          console.log("ERROR from ToggleAuth : ", err.message);
          setLoadingActivity(false);
        });
    }
  };

  return loading ? (
    <CustomPage backgroundColor={theme.backgroundColor}>
      <div
        className="ActivityPlanningPage"
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <Skeleton
          variant="rect"
          width={"100%"}
          height={"88vh"}
          style={{ borderRadius: 10 }}
        />
        <Skeleton
          variant="rect"
          width={"100%"}
          height={"88vh"}
          style={{ borderRadius: 10 }}
        />
      </div>
    </CustomPage>
  ) : (
    <CustomPage backgroundColor={theme.backgroundColor}>
      {!hasActivities ? (
        <>
          {isWeekend ? (
            <>
              <div className="SymptomLogPage">
                <CustomCard
                  label="What are your symptoms?"
                  // bodyPadding={20}
                  height="auto"
                >
                  <h5
                    style={{
                      color: theme.textColor3,
                      fontSize: 14,
                      marginLeft: 20,
                      fontWeight: 500,
                      marginTop: 10,
                    }}
                  >
                    On a scale from 0 to 10, please rate in an average across
                    part 7 days?
                  </h5>
                  <div style={{ padding: 20 }}>
                    <SymptomSlider
                      label="Pain"
                      theme={theme}
                      setValue={setPain}
                    />
                    <SymptomSlider
                      label="Fatigue"
                      theme={theme}
                      setValue={setFatigue}
                    />
                    <SymptomSlider
                      label="Nausea"
                      theme={theme}
                      setValue={setNausea}
                    />
                    <SymptomSlider
                      label="Disturbed Sleep"
                      theme={theme}
                      setValue={setDisturbedSleep}
                    />
                    <SymptomSlider
                      label="Anxiety or Nervousness"
                      theme={theme}
                      setValue={setAnxietyOrNervousness}
                    />
                    <SymptomSlider
                      label="Shortness of Breath"
                      theme={theme}
                      setValue={setShortnessOfBreath}
                    />
                    <SymptomSlider
                      label="Can’t Remember Things"
                      theme={theme}
                      setValue={setCantRememberThings}
                    />
                    <SymptomSlider
                      label="Lack of Appetite"
                      theme={theme}
                      setValue={setLackOfAppetite}
                    />
                    <SymptomSlider
                      label="Drowsy"
                      theme={theme}
                      setValue={setDrowsy}
                    />
                    <SymptomSlider
                      label="Sadness"
                      theme={theme}
                      setValue={setSadness}
                    />
                    <SymptomSlider
                      label="Vomit"
                      theme={theme}
                      setValue={setVomit}
                    />
                    <SymptomSlider
                      label="Numbness or Tingling"
                      theme={theme}
                      setValue={setNumbnessOrTingling}
                      paddingBottom="0px"
                    />
                  </div>
                </CustomCard>

                <div>
                  <CustomCard
                    label="Have your symptoms interfered with your activities?"
                    // bodyPadding={20}
                    height="auto"
                  >
                    <h5
                      style={{
                        color: theme.textColor3,
                        fontSize: 14,
                        marginLeft: 20,
                        fontWeight: 500,
                        marginTop: 10,
                      }}
                    >
                      On a scale from 0 to 10, please rate in an average across
                      part 7 days
                    </h5>
                    <div style={{ padding: 20 }}>
                      <SymptomSlider
                        label="General Activity"
                        theme={theme}
                        setValue={setGeneralActivity}
                      />
                      <SymptomSlider
                        label="Mood"
                        theme={theme}
                        setValue={setMood}
                      />
                      <SymptomSlider
                        label="Work"
                        theme={theme}
                        setValue={setWork}
                      />
                      <SymptomSlider
                        label="Relation With Others"
                        theme={theme}
                        setValue={setRelationWithOthers}
                      />
                      <SymptomSlider
                        label="Walking"
                        theme={theme}
                        setValue={setWalking}
                      />
                      <SymptomSlider
                        label="Enjoyment of Life"
                        theme={theme}
                        setValue={setEnjoymentOfLife}
                        paddingBottom="0px"
                      />
                    </div>
                  </CustomCard>

                  <CustomCard
                    label="What do you think about the exercise plan in the last week?"
                    // bodyPadding={20}
                    height="auto"
                  >
                    <h5
                      style={{
                        color: theme.textColor3,
                        fontSize: 14,
                        marginLeft: 20,
                        fontWeight: 500,
                        marginTop: 10,
                      }}
                    >
                      On a scale from 0 to 10, please rate in an average across
                      part 7 days
                    </h5>
                    <div style={{ padding: 20 }}>
                      <SymptomSlider
                        label="Difficulty Level"
                        theme={theme}
                        setValue={setDifficultyLevel}
                        text1="Too easy"
                        text2="Extremely Hard"
                        paddingBottom="0px"
                      />
                    </div>
                  </CustomCard>

                  <CustomButton
                    label="Save"
                    width="100%"
                    marginTop={20}
                    borderRadius={10}
                    loading={loadingActivity}
                    onClick={() => addActivity()}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <CustomCard
                height="auto"
                // label="Exercise Plan - Week #1"
                bodyPadding="0px 20px 20px 20px"
                height={500}
              >
                <div
                  style={{
                    height: 460,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p>
                    {`Please comeback on ${formattedDay(
                      endOfWeek(getFirstDayOfWeek())
                    )} to log your symptoms.`}
                  </p>
                </div>
              </CustomCard>
            </>
          )}
        </>
      ) : (
        <div>
          <CustomCard
            height="auto"
            // label="Exercise Plan - Week #1"
            bodyPadding="0px 20px 20px 20px"
            height={500}
          >
            <div
              style={{
                height: 460,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>
                {statusMessage ||
                  "You have finished the log for this week, come back next week"}
              </p>

              {statusMessage && (
                <Link
                  to="/activityPlanning"
                  style={{ marginTop: 20, textDecoration: "none" }}
                >
                  <Button style={{ color: theme.buttonColor }}>
                    Activity Planning
                  </Button>
                </Link>
              )}
            </div>
          </CustomCard>
        </div>
      )}
    </CustomPage>
  );
}