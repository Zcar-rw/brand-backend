export default (type, params) => {
  switch (type) {
    case 'New Registration':
      return `${params.firstName} ${params.lastName} has registered the account.`
    case 'New Car':
      return `${params.driverFirstName} ${params.driverLastName} has registered a new car(${params.carMakeName} - ${params.fabricationYear}).`
    case 'New Driver':
      return `${params.firstName} ${params.lastName} has requested to become a driver.`
    case 'Top Up':
      return `${params.firstName} ${params.lastName} has topped up his wallet with RWF ${params.amount}.`
    case 'New Ride':
      return `${params.firstName} ${
        params.lastName
      } has created a new ride(from ${params.pickupStationName} - to ${
        params.dropoffStationName
      }) which is scheduled to departure on ${new Date(
        params.departureTime
      ).toLocaleString()}.`
    case 'New Ride Request':
      return `${params.riderFirstName} ${
        params.riderLastName
      } has requested to join a ride of ${params.driverFirstName} ${
        params.driverLastName
      } which is scheduled to departure on ${new Date(
        params.departureTime
      ).toLocaleString()}.`
    case 'Passenger Car Enter':
      return `${params.riderFirstName} ${params.riderLastName} has been onboarded in ${params.driverFirstName} ${params.driverLastName}’s ride.`
    case 'Ride Completed':
      return `${params.driverFirstName} ${params.driverLastName}’s ride has reached destination and it has been completed.`
    case 'Driver Payout':
      return `${params.driverFirstName} ${params.driverLastName} has been payed RWF ${params.amount}`

    default:
      return 'Unknown activity type.'
  }
}
