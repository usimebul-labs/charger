import { getStations } from "@/app/actions/charger";
import { useQuery } from "@tanstack/react-query";

export const useStations = () => {
    return useQuery({
        queryKey: ['stations'],
        queryFn: () => getStations(),
        refetchInterval: 5000,
        refetchIntervalInBackground: true,
    });
};