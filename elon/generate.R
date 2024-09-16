library(ggplot2)
library(tidyr)

year <- 2002:2024
births_w <- c(1, 0, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
births_g <- c(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0)
births_z <- c(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1)
deaths <- -1 * c(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0)

birth_rates <- data.frame(year,
                          births_w,
                          births_g,
                          births_z,
                          deaths)

birth_rates_long <- gather(birth_rates, mother, rate, births_w:deaths, factor_key=TRUE)

total_df <- data.frame(year,
                       total=births_w+births_g+births_z+deaths)

p <- ggplot() +
  geom_hline(aes(yintercept = 0), color="#000", show.legend=FALSE) +
  # geom_area(data=birth_rates_long, aes(x = year, y = rate, fill=mother), alpha=0.5) +
  geom_bar(data=birth_rates_long, aes(x = year, y = rate, fill=mother), alpha=0.5, position="stack", stat="identity") +
  geom_line(data=total_df, aes(x=year,y=total, color="#222"), linetype="dashed", size=1.2) +
  scale_x_continuous(limits=c(2001, 2025), labels=seq(2002,2024,1), breaks=seq(2002,2024,1), minor_breaks=seq(2001,2025,1)) +
  scale_y_continuous(labels = scales::label_number(accuracy = 1), limits=c(-1, 4), minor_breaks=NULL) +
  labs(title="Elon Musk Birth Rate by Year", x="Year", y="Birth Rate", fill=NULL) +
  scale_color_identity(name=NULL, labels = c('Net Birth Rate'), guide="legend") +
  scale_fill_manual(labels = c("By Wilson", "By Grimes", "By Zilis", "Deaths"), values = c("#00ccb1", "#0062ff", "#e905ed", "#ff0000")) +
  theme(legend.position = c(0.5, 0.9), legend.direction="horizontal", legend.box = "horizontal", legend.background = element_rect(fill="#fff"), plot.margin = unit(c(0.3,0.3,0.2,0.2), "in")) +
  annotate("text", x =2015.5, y = -0.75, label = 'Vivian Jenna Wilson\n("dead to him")', size=unit(3.5, "cm")) +
  annotate("segment", x = 2018, xend = 2021.5, y = -0.75, yend = -1, size=0.3,
           arrow = arrow(length = unit(.4,"cm"))) +
  guides(fill = guide_legend(order=2),
         color = guide_legend(order=1)) +
  labs(tag="by brat.boats", size=4) +
  theme(plot.tag.position = c(0.905, 0.99)) +
  theme(plot.title=element_text(face="bold"), text=element_text(family="Inter")) +
  theme(
    panel.background = element_rect(fill = "#fff",
                                    colour = "#fff",
                                    size = 0.5, linetype = "solid"),
    panel.grid.major = element_line(size = 0.5, linetype = 'solid',
                                    colour = "#eee"), 
    panel.grid.minor = element_line(size = 0.25, linetype = 'solid',
                                    colour = "#fff"),
    axis.text.x = element_text(angle=90,vjust = 0.5, hjust=1),
    axis.line = element_line(colour = "black")
  )
  

print(p)

ggsave("elonbirthrate.png",
       width=8,
       height=4,
       units="in")