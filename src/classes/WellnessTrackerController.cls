global with sharing class WellnessTrackerController {

    @RemoteAction
    global static List<WellnessRank> getWeeklyRanking() {
        List<WellnessRank> rankList = new List<WellnessRank>();

        /*
         * Not sure why, but needed to alias the relationship fields
         * http://salesforce.stackexchange.com/questions/19381/reference-fields-on-parent-object-in-aggregate-query
         */
        for (AggregateResult result : [SELECT SUM(Wellness_Goal__r.Points__c) points, User__c, User__r.FirstName firstname, User__r.LastName lastname
                                        FROM Wellness_Activity__c 
                                        WHERE Achievement_Date__c = LAST_N_DAYS:7
                                        GROUP BY User__c, User__r.FirstName, User__r.LastName])
        {
            WellnessRank rank = new WellnessRank();
            rank.userId = String.valueOf(result.get('User__c'));
            rank.userName = String.valueOf(result.get('firstname')) + ' ' + String.valueOf(result.get('lastname'));
            rank.points = Integer.valueOf(result.get('points'));
            rankList.add(rank);
        }

        rankList.sort();
        return rankList;
    }

    global class WellnessRank implements Comparable{
        global String userId;
        global String userName;
        global Integer points;

        global Integer compareTo(Object compareObj) {
            WellnessRank compareTo = (WellnessRank)compareObj;

            if (points < compareTo.points) {
                return 1;
            } else if (points > compareTo.points) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}