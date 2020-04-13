/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
const convertToDays = (periodType, timeToElapse) => {
  const type = periodType.toLowerCase();
  const time = Number(timeToElapse);

  switch (type) {
    case 'days':
      return time;
    case 'weeks':
      return time * 7;
    case 'months':
      return time * 30;
    default:
      return time;
  }
};

const dollars = (
  obj,
  avgDailyIncomePopulation,
  avgDailyIncomeInUSD,
  periodType,
  timeToElapse
) => {
  const ans = Math.trunc(
    (obj.infectionsByRequestedTime *
      avgDailyIncomePopulation *
      avgDailyIncomeInUSD) /
      convertToDays(periodType, timeToElapse)
  );
  return ans;
};

const inputData = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};

const covid19ImpactEstimator = (data = inputData) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
  } = data;

  const output = {
    data,
    impact: {},
    severeImpact: {}
  };

  // CHALLENGE 1: CurrentlyInfected
  output.impact.currentlyInfected = Math.trunc(reportedCases * 10);
  output.severeImpact.currentlyInfected = Math.trunc(reportedCases * 50);

  // Infections By Requested
  const factor = Math.trunc(convertToDays(periodType, timeToElapse) / 3);
  const power = 2 ** factor;
  output.impact.infectionsByRequestedTime =
    output.impact.currentlyInfected * power;

  output.severeImpact.infectionsByRequestedTime =
    output.severeImpact.currentlyInfected * power;

  // CHALLENGE 2: Severe Cases Requested By Time
  output.impact.severeCasesByRequestedTime = Math.trunc(
    0.15 * output.impact.infectionsByRequestedTime
  );
  output.severeImpact.severeCasesByRequestedTime = Math.trunc(
    0.15 * output.severeImpact.infectionsByRequestedTime
  );

  // Hospital Beds Requested By Time
  // eslint-disable-next-line operator-linebreak
  output.impact.hospitalBedsByRequestedTime = Math.trunc(
    0.35 * totalHospitalBeds - output.impact.severeCasesByRequestedTime
  );
  output.severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    0.35 * totalHospitalBeds - output.severeImpact.severeCasesByRequestedTime
  );

  // CHALLENGE 3: CasesForICU
  output.impact.casesForICUByRequestedTime = Math.trunc(
    0.05 * output.impact.infectionsByRequestedTime
  );
  output.severeImpact.casesForICUByRequestedTime = Math.trunc(
    0.05 * output.severeImpact.infectionsByRequestedTime
  );

  // Cases For Ventilators
  output.impact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * output.impact.infectionsByRequestedTime
  );
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * output.severeImpact.infectionsByRequestedTime
  );

  // Dollars In Flight
  output.impact.dollarsInFlight = dollars(
    output.impact,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    periodType,
    timeToElapse
  );

  output.severeImpact.dollarsInFlight = dollars(
    output.severeImpact,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    periodType,
    timeToElapse
  );

  return output;
};

export default covid19ImpactEstimator;
