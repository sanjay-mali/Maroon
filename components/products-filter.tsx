"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export default function ProductsFilter() {
  const [priceRange, setPriceRange] = useState([1000, 25000])

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["category", "price", "color", "fabric", "occasion"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="category-sarees" />
                <Label htmlFor="category-sarees">Sarees</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-lehengas" />
                <Label htmlFor="category-lehengas">Lehengas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-kurtis" />
                <Label htmlFor="category-kurtis">Kurtis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-gowns" />
                <Label htmlFor="category-gowns">Gowns</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-accessories" />
                <Label htmlFor="category-accessories">Accessories</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[1000, 25000]}
                min={1000}
                max={50000}
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">₹{priceRange[0].toLocaleString()}</span>
                <span className="text-sm">₹{priceRange[1].toLocaleString()}</span>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-under5000" />
                  <Label htmlFor="price-under5000">Under ₹5,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-5000to10000" />
                  <Label htmlFor="price-5000to10000">₹5,000 - ₹10,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-10000to20000" />
                  <Label htmlFor="price-10000to20000">₹10,000 - ₹20,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-over20000" />
                  <Label htmlFor="price-over20000">Over ₹20,000</Label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-pink-500 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-blue-600 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-green-600 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-500 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-purple-600 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-black border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-white border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-orange-500 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-teal-500 border border-gray-300 cursor-pointer"></div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fabric">
          <AccordionTrigger>Fabric</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="fabric-silk" />
                <Label htmlFor="fabric-silk">Silk</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fabric-cotton" />
                <Label htmlFor="fabric-cotton">Cotton</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fabric-georgette" />
                <Label htmlFor="fabric-georgette">Georgette</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fabric-chiffon" />
                <Label htmlFor="fabric-chiffon">Chiffon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fabric-crepe" />
                <Label htmlFor="fabric-crepe">Crepe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fabric-organza" />
                <Label htmlFor="fabric-organza">Organza</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="occasion">
          <AccordionTrigger>Occasion</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="occasion-wedding" />
                <Label htmlFor="occasion-wedding">Wedding</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="occasion-festive" />
                <Label htmlFor="occasion-festive">Festive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="occasion-party" />
                <Label htmlFor="occasion-party">Party</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="occasion-casual" />
                <Label htmlFor="occasion-casual">Casual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="occasion-office" />
                <Label htmlFor="occasion-office">Office Wear</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
